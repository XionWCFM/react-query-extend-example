self.onmessage = (e: MessageEvent<{ list: { type: "DEFAULT" | "HELLO"; content: string }[] }>) => {
  const filteredData = e.data.list.filter((item) => item.type === "HELLO");
  self.postMessage(filteredData);
};
