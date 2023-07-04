import React, {useEffect, useRef} from "react";
import useKakaoMap from "./useKakaoMap";

const App = ({address = '제주특별자치도 제주시 관덕로 36'}) => {
  const mapRef = useRef(null);
  const {ready, focusToAddress, createNewMap} = useKakaoMap();

  useEffect(() => {
    const initKakaoMap = async () => {
      const map = createNewMap(mapRef.current, {});
      await focusToAddress(address, map)
    };
    if (ready) initKakaoMap();
  }, [ready]);

  return <div ref={mapRef} style={{height: 600, width: '100%'}}/>
}

export default App;
