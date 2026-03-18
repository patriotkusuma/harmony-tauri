import { useCallback, useEffect } from "react"

const useHotKeys = (keyMap) => {
    const handleKeyPress = useCallback((event) => {
        const {keyCode, key} = event
        for (const hotkey in keyMap){
            const hotKeyConfig = keyMap[hotkey]
            if(hotKeyConfig.keyCode === keyCode || hotKeyConfig.key === key){
                hotKeyConfig.handler(event)
                if(hotKeyConfig.preventDefault){
                    event.preventDefault()
                }
            }
        }
    }, [keyMap])

    useEffect(()=>{
        window.addEventListener('keydown', handleKeyPress)
        return ()=>{
            window.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])
}

export default useHotKeys