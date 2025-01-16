
// let ws = null;
let ws1 = null;
let ws2 = null;
let activePage = null; // 현재 활성 페이지

const createWebSocket = (url, pageKey) => {
    let ws = new WebSocket(url);

    ws.open = () => {
        console.log(`WebSocket connection opened for ${pageKey}`);
    }
    ws.onmessage = (event) => {
        if (activePage === pageKey) {
            handleWebSocketMessage(event, pageKey);
        }
    };
    ws.onclose = () => {
        console.log(`WebSocket connection closed for ${pageKey}. Retrying...`);
        ws = null;
        setTimeout(() => createWebSocket(url, pageKey), 3000);  // 3초마다 재연결 시도
    };
    ws.onerror = (error) => {
        console.error(`WebSocket error for ${pageKey}:`, error);
        ws.close();
    };
    return ws;
};

export const connectWebSocket = () => {
    
    if (!ws1 || ws1.readyState !== WebSocket.OPEN) {
        ws1 = createWebSocket('ws://localhost:8000/stream/stream1', 'cctv');
    }
    if (!ws2 || ws2.readyState !== WebSocket.OPEN) {
        ws2 = createWebSocket('ws://localhost:8000/stream/stream2', 'cctv_2');
    }

    // if (ws && ws.readyState === WebSocket.OPEN) return;  // 이미 연결되어 있으면 중복 연결 방지
    // ws = new WebSocket('ws://localhost:8000/stream');

    // ws.onopen = () => {
    //     console.log("WebSocket connection opened!");
    // }
    // ws.onmessage = (event) => {
    //     if (!activePage) return;  // 활성화 페이지 없으면 데이터 무시
    //     // console.log("Message from server:", event.data); // 데이터를 로깅하거나 상태 업데이트
    //     if (typeof event.data === "string") {
    //         handleTextMessage(event.data);  // 텍스트 데이터 처리
    //     } else if (event.data instanceof Blob) {
    //         handleVideoMessage(event.data);  // 바이너리 데이터 처리
    //     }
    // };
    // ws.onclose = () =>  {
    //     console.log("WebSocket connection closed. Retrying...");
    //     ws = null;
    //     setTimeout(connectWebSocket, 3000);  // 연결이 끊기면 3초 뒤에 다시 연결 시도
    // };
    // ws.onerror = (error) => {
    //     console.error("WebSocket error:", error);
    //     ws.close();
    // };
};

const handleWebSocketMessage = (event, source) => {
    if (!activePage) return;
    if (typeof event.data === "string") {
        handleTextMessage(event.data, source);
    } else if (event.data instanceof Blob) {
        handleVideoMessage(event.data, source);
    } else {
        console.error(`Unexpected data type from ${source}:`, event.data);
    }
};

const handleTextMessage = (message, source) => {
    if (!message) return;  // 데이터가 비어있으면 처리하지 않음
    // console.log(`Text Message from ${source}:`, message);

    // counting 페이지 업데이트
    const event = new CustomEvent("countingUpdate", { detail: { count: message, source }});
    window.dispatchEvent(event);  // counting 페이지로 이벤트 전달
};

const handleVideoMessage = async (blob, source) => {
    // console.log("Binary Message Received");
    try {
        if (!blob) return;  // 데이터가 비어있으면 처리하지 않음

        // Blob 데이터를 cctv 페이지로 전달
        const arrayBuffer = await blob.arrayBuffer();
        const event = new CustomEvent("cctvUpdate", { detail: { frame: arrayBuffer, source }});
        window.dispatchEvent(event);  // cctv 페이지로 이벤트 전달
    } catch (error) {
        console.error(`Error processing Binary message from ${source}`, error);
    }    
};

// 활성 페이지 설정
export const setActivePage = (page) => {
    activePage = page;
    console.log(`Active page set to: ${page}`);
};

export const getWebSocket = () => ({ ws1, ws2 });  // WebSocket 객체를 가져오는 함수