// 클로저를 활용해 토큰 관리
// 싱글톤 패턴으로 구현하여 전역에서 사용 가능
const tokenManager = (() => {
  let accessToken: string | undefined;

  return {
    setToken: (token: string) => {
      accessToken = token;
    },
    getToken: () => accessToken,
    clearToken: () => {
      accessToken = undefined;
    },
  };
})();
// 즉시 실행 함수 IIFE로 모듈의 캡슐화를 유지하면서 외부로 함수의 결과물을 노출하지 않고
// 모듈의 내부 상태 보호

// accesstoken 외부 접근 불가, 오직 반환된 객체의 메서드를 통해서만 상태에 접근 가능

export default tokenManager;
