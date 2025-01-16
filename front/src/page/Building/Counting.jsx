import React, { useState, useEffect } from "react";
import { setActivePage } from "../websocketManager";

function Counting() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // 페이지 활성화
        setActivePage("counting");

        const handleCountingUpdate = (event) => {
            // console.log(event.detail);
            setCount(event.detail.count);  // 서버에서 받은 카운트 업데이트
        };

        window.addEventListener("countingUpdate", handleCountingUpdate);

        return () => {
            setActivePage(null);  // 페이지 비활성화
            window.removeEventListener("countingUpdate", handleCountingUpdate);
        };
    }, []);

    return (
        <div>
            <h1>Real-Time Count</h1>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{count}</p>
        </div>
    );
}

export default Counting;