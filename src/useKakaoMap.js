import { useEffect, useState } from 'react';

const useKakaoMap = () => {
  const [isReady, setIsReady] = useState(false);

  const hasKakaoMapScript = document.getElementById('kakao-map') != null;

  useEffect(() => {
    const checkKakaoScript = () => {
      setTimeout(() => {
        if (!window.kakaoMapReady) checkKakaoScript();

        setIsReady(true);
      }, 500);
    };

    if (hasKakaoMapScript) checkKakaoScript();
  }, []);

  if (!hasKakaoMapScript) {
    const scriptEl = document.createElement('script');
    scriptEl.id = 'kakao-map';
    scriptEl.async = true;
    scriptEl.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_API_KEY}&libraries=services&autoload=false`;
    scriptEl.onload = () => {
      window.kakao.maps.load(() => {
        window.kakaoMapReady = true;
        setIsReady(true);
      });
    };
    document.head.appendChild(scriptEl);
  }

  const createNewMap = (containerDom, options) => {
    return new window.kakao.maps.Map(containerDom, {
      level: 3,
      center: new window.kakao.maps.LatLng(33.450701, 126.570667),
      ...options,
    });
  };

  const createNewStaticMap = (containerDom, options) => {
    const DEFAULT_POSITION = new window.kakao.maps.LatLng(33.450701, 126.570667);
    return new window.kakao.maps.StaticMap(containerDom, {
      level: 3,
      center: DEFAULT_POSITION,
      marker: {
        position: DEFAULT_POSITION,
        text: '(주)메타플라이어',
      },
      ...options,
    });
  };

  const searchAddress = (searchValue) =>
    new Promise((resolve) => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(searchValue, (res, status) => (status === 'OK' ? resolve(res) : resolve([])));
    });

  const focusToAddress = async (address, map) => {
    // search address
    const [addressMatched] = await searchAddress(address);

    if (addressMatched) {
      // from search result convert to LatLng position on map
      const latlng = new window.kakao.maps.LatLng(addressMatched.y, addressMatched.x);

      // add marker to map
      const marker = new window.kakao.maps.Marker({position: latlng});
      marker.setMap(map);

      // Map focus center to address
      map.setCenter(latlng);
    }
  };

  return {ready: isReady, createNewMap, createNewStaticMap, searchAddress, focusToAddress};
};

export default useKakaoMap;
