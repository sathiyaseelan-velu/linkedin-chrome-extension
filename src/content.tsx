import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

import IndexPopup from "./popup"

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const TextAreaOverlay = () => {
  const textAreaContainerRef = useRef<HTMLElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleInsertMessage = (message: string) => {
    if (!textAreaContainerRef.current) return
    const textArea = textAreaContainerRef.current.querySelector("p")
    if (textArea) {
      textArea.innerText = message
      textArea.dispatchEvent(new Event("input", { bubbles: true }))
      textAreaContainerRef.current.focus()
      setShowModal(false)
    }
  }

  useEffect(() => {
    const handleFocusEvent = (event: FocusEvent) => {
      const target = event.target as HTMLElement
      if (target && target.classList.contains("msg-form__contenteditable")) {
        textAreaContainerRef.current = target
        let buttonPosition = {
          x:
            target.getBoundingClientRect().left +
            (target.clientWidth -
              parseInt(window.getComputedStyle(target).marginRight)),
          y: target.getBoundingClientRect().top + (target.clientHeight - 40)
        }
        if (buttonRef.current) {
          const button = buttonRef.current
          button.style.left = buttonPosition.x + "px"
          button.style.top = buttonPosition.y + "px"
          button.style.display = "block"
        }
      }
    }
    // Add a focus event listener to the document body
    document.body.addEventListener("focus", handleFocusEvent, true)
    return () => {
      document.body.removeEventListener("focus", handleFocusEvent, true)
    }
  }, [])

  useEffect(() => {
    if (!buttonRef.current) return
    const img = buttonRef.current.querySelector("img")
    if (showModal) {
      img.src = chrome.runtime.getURL("assets/generating.svg")
    } else {
      img.src = chrome.runtime.getURL("assets/ai_icon.svg")
    }
  }, [showModal])

  /* The `useEffect` hook in the provided code snippet is setting up an event listener for the `click`
  event on the window. When a click event occurs outside of text area, it'll hide the extension icon */
  useEffect(() => {
    const handleClickEvent = (e: MouseEvent) => {
      const target = e.target
      if (
        target instanceof HTMLElement &&
        (target.closest(".msg-form__contenteditable") ||
          target.tagName === "PLASMO-CSUI")
      )
        return
      buttonRef.current.style.display = "none"
      textAreaContainerRef.current = null
    }

    window.addEventListener("click", handleClickEvent)
    return () => {
      window.removeEventListener("click", handleClickEvent)
    }
  }, [])

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        ref={buttonRef}
        className="fixed hidden">
        <img src={chrome.runtime.getURL("assets/ai_icon.svg")} alt="" />
      </button>
      {showModal && (
        <IndexPopup onInsert={handleInsertMessage} onClose={handleClose} />
      )}
    </>
  )
}

export default TextAreaOverlay
