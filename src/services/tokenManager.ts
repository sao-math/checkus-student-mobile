/**
 * 토큰 관리 전용 모듈
 * 액세스 토큰과 리프레시 토큰의 저장, 검증, 만료 확인 등을 담당
 */

// 액세스 토큰은 메모리에서만 관리
let accessToken: string | null = null;

export const tokenManager = {
  /**
   * 액세스 토큰 반환 (메모리에서)
   */
  getAccessToken(): string | null {
    return accessToken;
  },

  /**
   * 액세스 토큰 설정 (메모리에)
   */
  setAccessToken(newAccessToken: string): void {
    accessToken = newAccessToken;
    console.log('Access token updated in memory');
  },

  /**
   * 액세스 토큰 제거 (메모리에서)
   */
  clearAccessToken(): void {
    accessToken = null;
    console.log('Access token cleared from memory');
  },

  /**
   * 인증 상태 확인 (메모리의 액세스 토큰 기준)
   */
  isAuthenticated(): boolean {
    return !!accessToken;
  },

  /**
   * 토큰이 만료되었는지 확인
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const isExpired = expirationTime < currentTime;
      
      if (isExpired) {
        console.log('Token expired:', {
          expirationTime: new Date(expirationTime),
          currentTime: new Date(currentTime)
        });
      }
      
      return isExpired;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  },

  /**
   * 현재 액세스 토큰이 유효한지 확인
   */
  isCurrentTokenValid(): boolean {
    const currentAccessToken = this.getAccessToken();
    
    if (!currentAccessToken) {
      return false;
    }
    
    return !this.isTokenExpired(currentAccessToken);
  },

  /**
   * 토큰 페이로드 디코딩
   */
  decodeTokenPayload(token: string): any | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error decoding token payload:', error);
      return null;
    }
  },

  /**
   * 토큰 만료 시간까지 남은 시간 (분 단위)
   */
  getTimeUntilExpiry(token: string): number {
    try {
      const payload = this.decodeTokenPayload(token);
      if (!payload) return 0;
      
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;
      
      return Math.floor(timeUntilExpiry / 1000 / 60); // 분 단위
    } catch (error) {
      console.error('Error calculating time until expiry:', error);
      return 0;
    }
  },

  /**
   * 디버깅을 위한 토큰 상태 확인
   */
  debugTokenStatus(): void {
    const currentAccessToken = this.getAccessToken();
    
    console.log('=== Token Status Debug ===');
    console.log('Has Access Token in Memory:', !!currentAccessToken);
    console.log('Cookies:', document.cookie); // 리프레시 토큰 쿠키 확인용
    
    if (currentAccessToken) {
      const payload = this.decodeTokenPayload(currentAccessToken);
      if (payload) {
        const expirationTime = payload.exp * 1000;
        const timeUntilExpiry = this.getTimeUntilExpiry(currentAccessToken);
        
        console.log('Access Token Expiry:', new Date(expirationTime));
        console.log('Current Time:', new Date());
        console.log('Time Until Expiry:', `${timeUntilExpiry} minutes`);
        console.log('Is Expired:', this.isTokenExpired(currentAccessToken));
        console.log('Is Valid:', this.isCurrentTokenValid());
      }
    }
    
    console.log('=== End Token Status ===');
  }
}; 