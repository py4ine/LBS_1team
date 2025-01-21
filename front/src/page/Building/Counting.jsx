import React, { useState, useEffect } from "react";
import { setActivePage } from "../websocketManager";

function Counting() {
    const [count, setCount] = useState({ stream1: 0, stream2: 0});

    useEffect(() => {
        // 페이지 활성화
        setActivePage("counting");

        const handleCountingUpdate = (event) => {
            console.log("Event received:", event.detail);
            const { count, source } = event.detail;  // count와 source를 이벤트에서 추출
            setCount((prevCounts) => ({
                ...prevCounts,
                [source]: count,  // source를 키로 사용해 해당 count만 업데이트
            }));  // 서버에서 받은 카운트 업데이트
        };

        window.addEventListener("countingUpdate", handleCountingUpdate);

        return () => {
            setActivePage(null);  // 페이지 비활성화
            window.removeEventListener("countingUpdate", handleCountingUpdate);
        };
    }, []);

    return (
        <div>
            <h1>Real-Time Counts</h1>
            <div style={{ fontSize: "1.5rem" }}>
                <p>
                    <strong>Stream 1 Count:</strong> {count.stream1}
                </p>
                <p>
                    <strong>Stream 2 Count:</strong> {count.stream2}
                </p>
            </div>
        </div>
    );
}

export default Counting;