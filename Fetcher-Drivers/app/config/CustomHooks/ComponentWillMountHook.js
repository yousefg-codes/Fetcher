import { useState, useEffect } from "react"

export default componentWillMountHook = async (func) => {
    const [hasRendered, setHasRendered] = useState(false)
    useEffect(() => setHasRendered(true), [hasRendered]);
    if(hasRendered){
        await func();
    }
}