import React, {useEffect, useRef, useState} from "react";
import useKakaoMap from "./kakaoMap/useKakaoMap";
import useGoogleMap from "./googleMap/useGoogleMap";
import '../web-component/KakaoMap'

const App = () => {
  const kakaoMap = useRef(null);
  const googleMap = useRef(null);
  const kakaoMapDom = useRef(null);
  const googleMapDom = useRef(null);
  const googleSearchInput = useRef(null);
  const [searchKakaoAddress, setSearchKakaoAddress] = useState('');
  const [address, setAddress] = useState()
  const [searchValue, setSearchValue] = useState('제주특별자치도 제주시 관덕로 36')
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

  const handleTypingAddress = (e) => {
    setAddress(e.target.value);
  }

  const search = () => {
    setSearchValue(address);
  }

  return <div>
    <div style={{display: 'grid', gridTemplateColumns: '600px auto', gap: 24}}>
      <div style={{boxShadow: '0 0 1px 1px #000', padding: 16, borderRadius: 8}}>
        <h1 style={{textAlign: 'center'}}>
          Map Service - Web Component
        </h1>
        <strong>Information:</strong>
        <p>Source: <code>import "web-component/KakaoMap"</code></p>
        <p>
          Tag: <code><strong>ice-kakao-map</strong></code>
        </p>
        <strong>Props:</strong>
        <ul>
          <li>
            <code><strong>api-key</strong>: 5d8b683dd3ff75bcb0ed805f8aac3689</code>
          </li>
          <li>
            <code><strong>address</strong>: 제주특별자치도 제주시 관덕로 36</code>
          </li>
          <li>
            <code><strong>height</strong>: 600px</code>
          </li>
        </ul>
        <strong>Example:</strong>
        <p>
          <code><strong>&lt;ice-kakao-map api-key="..." address="제주특별자치도 제주시 관덕로 36" /&gt;</strong></code>
        </p>
      </div>
      <img src="kakao-demo.png" placeholder="Kakao Map" style={{width: '100%', height: 'auto'}}/>
    </div>
    <h2 style={{textAlign: 'center'}}>Demonstration</h2>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 24}}>
      <input
        style={{padding: '.5rem .75rem', width: 400}}
        placeholder="Search Address"
        onChange={handleTypingAddress}
        value={address}
      />
      <button style={{padding: '.5rem .75rem'}} onClick={search}>Search</button>
    </div>
    <ice-kakao-map
      height="500px"
      api-key="5d8b683dd3ff75bcb0ed805f8aac3689"
      address={searchValue}
    />
    <div style={{width: 600, margin: '24px auto 0 auto', boxShadow: '0 0 1px 1px #000', padding: 16, borderRadius: 8}}>
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
