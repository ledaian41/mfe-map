import React, {useEffect, useRef, useState} from "react";
import useKakaoMap from "./kakaoMap/useKakaoMap";
import useGoogleMap from "./googleMap/useGoogleMap";

const App = () => {
  const kakaoMap = useRef(null);
  const googleMap = useRef(null);
  const kakaoMapDom = useRef(null);
  const googleMapDom = useRef(null);
  const googleSearchInput = useRef(null);
  const [searchKakaoAddress, setSearchKakaoAddress] = useState('');
  const [searchGoogleAddress, setSearchGoogleAddress] = useState('');
  const kakao = useKakaoMap();
  const google = useGoogleMap();

  useEffect(() => {
    const initKakaoMap = async () => {
      kakaoMap.current = kakao.createNewMap(kakaoMapDom.current, {});
    };
    if (kakao.ready) initKakaoMap();
  }, [kakao.ready]);

  useEffect(() => {
    const initGoogleMap = async () => {
      googleMap.current = google.createNewMap(googleMapDom.current, {});
      google.placeSearchInput(googleSearchInput.current, googleMap.current);
    };
    if (kakao.ready) initGoogleMap();
  }, [kakao.ready]);

  const searchAddress = async () => {
    if (!searchKakaoAddress) return;
    await kakao.focusToAddress(searchKakaoAddress, kakaoMap.current)
  }

  return <div>
    <div
      style={{width: 600, margin: '24px auto 0 auto', boxShadow: '0 0 1px 1px #000', padding: 16, borderRadius: 8}}>
      <h1 style={{textAlign: 'center'}}>Micro Frontend Map Service Application</h1>
      <strong>Information:</strong>
      <p>
        Remote File: RemoteEntry.js
      </p>
      <p>
        Scope: map
      </p>
      <p>
        Modules: KakaoMap, GoogleMap
      </p>
    </div>
    <h2 style={{textAlign: 'center'}}>Demonstration</h2>
    <div style={{display: "grid", gridTemplateColumns: 'repeat(2, 1fr)', gap: 16}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <h3 style={{textAlign: 'center'}}>Kakao Map</h3>
        <div style={{display: 'flex', gap: 8}}>
          <input
            style={{width: '100%', padding: 8}}
            value={searchKakaoAddress}
            onChange={(e) => setSearchKakaoAddress(e.target.value)}
            placeholder="Search address"
          />
          <button style={{flex: 1, padding: '8px 16px', cursor: 'pointer'}} onClick={searchAddress}>
            Search
          </button>
        </div>
        <div ref={kakaoMapDom} style={{height: 600, width: '100%'}}/>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        <h3 style={{textAlign: 'center'}}>Google Map</h3>
        <input ref={googleSearchInput} style={{width: '50%', padding: 8}} placeholder="Search address"/>
        <div ref={googleMapDom} style={{height: 600, width: '100%'}}/>
      </div>
    </div>
  </div>
}

export default App;
