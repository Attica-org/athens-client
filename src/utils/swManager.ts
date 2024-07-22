// 클로저를 활용해 서비스워커의 tabId 관리
// 싱글톤 패턴으로 구현하여 전역에서 사용 가능
const swManager = (() => {
  let tabId: string | null;

  return {
    setTabId: (id: string) => {
      tabId = id;
    },
    getTabId: () => tabId,
    clearTabId: () => {
      tabId = null;
    },
  };
})();

export default swManager;
