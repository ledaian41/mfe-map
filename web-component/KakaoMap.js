const COMPONENT_NAME = 'ice-kakao-map';

const template = document.createElement('template');
template.innerHTML = `
 <style type="text/css">
  :host(${COMPONENT_NAME}) .kakao-map {
    width: 100%;
  }
 </style>
 <div class="kakao-map"></div>
`;

const loadScript = (apiKey, callback) => {
  if (apiKey == null) return;

  if (window.kakaoMapReady) {
    callback();
    return;
  }

  const script = document.getElementById("kakao-map")
  if (script != null) {
    script.parentNode.removeChild(script)
  }
  const scriptEl = document.createElement('script');
  scriptEl.id = 'kakao-map';
  scriptEl.async = true;
  scriptEl.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
  scriptEl.onload = () => {
    window.kakao.maps.load(() => {
      window.kakaoMapReady = true;
      callback();
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

class KakaoMap extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({mode: 'closed'});
    this._shadowRoot.append(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['api-key', 'address', 'height']
  }

  get apiKey() {
    return this.getAttribute('api-key');
  }

  get address() {
    return this.getAttribute('address');
  }

  get height() {
    return this.getAttribute('height') || "600px";
  }

  set height(value) {
    this.setAttribute('height', value);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal == null) return;
    const mapElement = this._shadowRoot.querySelector('.kakao-map');
    if (attrName === 'api-key') {
      window.kakaoMapReady = false;
      this.connectedCallback()
    }
    if (attrName === 'address') {
      if (this.map == null) return;
      focusToAddress(newVal, this.map)
    }
    if (attrName === 'height') {
      mapElement.style.height = newVal;
    }
  }

  connectedCallback() {
    const mapElement = this._shadowRoot.querySelector('.kakao-map');
    mapElement.style.height = this.height;
    const registerMap = () => {
      this.map = createNewMap(mapElement, {})
      focusToAddress(this.address, this.map)
    }
    loadScript(this.apiKey, registerMap);
  }
}

if (!window.customElements.get(COMPONENT_NAME)) {
  window.customElements.define(COMPONENT_NAME, KakaoMap);
}
