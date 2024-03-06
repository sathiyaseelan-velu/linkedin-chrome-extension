import { useRef, useState } from "react"

import "~style.css"

const STATIC_MESSAGE =
  "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."

interface IProps {
  onInsert: (text: string) => void
  onClose: () => void
}

function IndexPopup({ onInsert, onClose }: IProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const promptsContainerRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [showRegenerate, setShowRegenerate] = useState<boolean>(false)

  const addPrompt = (prompt: string) => {
    const promptsContainer = promptsContainerRef.current
    const div = document.createElement("div")
    div.className =
      "max-w-[80%] p-4 rounded-xl bg-gray-100 text-2xl text-gray-500 self-end"
    div.innerText = prompt
    promptsContainer.appendChild(div)
    promptsContainer.scrollTop = promptsContainer.scrollHeight
  }

  const addPromptResponse = (response: string) => {
    const promptsContainer = promptsContainerRef.current
    const div = document.createElement("div")
    div.className =
      "max-w-[80%] p-4 rounded-xl bg-[#DBEAFE] text-2xl text-gray-500 self-start"
    div.innerText = response
    promptsContainer.appendChild(div)
    promptsContainer.scrollTop = promptsContainer.scrollHeight
  }

  const handleGenerate = () => {
    const input = inputRef.current
    if (!input.value) return
    const prompt = input.value
    addPrompt(prompt)
    setShowRegenerate(true)
    setLoading(true)
    setTimeout(() => {
      addPromptResponse(STATIC_MESSAGE)
      setLoading(false)
    }, 500)
    input.value = ""
  }

  const handleRegenerate = () => {}

  const handleInsertMessage = () => {
    onInsert(STATIC_MESSAGE)
  }

  /**
   * The handleClickOutside function checks if a click event occurred outside a specified modal element
   * and calls the onClose function if it did.
   */
  const handleClickOutside = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  return (
    <div
      className="fixed top-0 backdrop-contrast-[.6] h-screen w-screen flex items-center justify-center"
      onClick={handleClickOutside}>
      <div
        ref={modalRef}
        id="prompt_modal"
        className="shadow-md bg-[#F9FAFB] min-h-[192px] w-[870px] rounded-2xl p-[26px] flex flex-col gap-[26px] items-end">
        {/* Container for prompts */}
        <div
          className="w-full flex flex-col gap-[26px]"
          ref={promptsContainerRef}
        />

        {/* Loading indicator */}
        {loading && (
          <div className="self-start">
            <img
              src={chrome.runtime.getURL("assets/loader.gif")}
              alt=""
              className="h-12"
            />
          </div>
        )}

        {/* Input for prompts */}
        <input
          className="flex justify-center items-center gap-4 w-[818px] h-[61px] shadow-inner rounded-xl border-2 text-2xl font-medium text-gray-500 placeholder:text-gray-300 px-4 py-1.5 focus:outline-[#3B82F6]"
          placeholder="Your Prompt"
          autoFocus
          ref={inputRef}
        />

        {/* Buttons for actions */}
        {showRegenerate ? (
          <div className="flex gap-[26px]">
            <button
              className="btn outlined"
              onClick={handleInsertMessage}
              type="button">
              <img
                src={chrome.runtime.getURL("assets/arrow_down.svg")}
                alt=""
                className="h-6 w-6"
              />
              <label>Insert</label>
            </button>
            <button
              className="btn filled"
              onClick={handleRegenerate}
              type="button">
              <img
                src={chrome.runtime.getURL("assets/refresh.svg")}
                alt=""
                className="h-6 w-6"
              />
              <label>Regenerate</label>
            </button>
          </div>
        ) : (
          <button className="btn filled" onClick={handleGenerate} type="button">
            <img
              src={chrome.runtime.getURL("assets/send.svg")}
              alt=""
              className="h-6 w-6"
            />
            <label>Generate</label>
          </button>
        )}
      </div>
    </div>
  )
}

export default IndexPopup
