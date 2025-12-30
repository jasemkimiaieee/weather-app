window.addEventListener("load", async () => {
  "use strict";

  const countries = {
    AF: "Afghanistan",
    AL: "Albania",
    DZ: "Algeria",
    AS: "American Samoa",
    AD: "Andorra",
    AO: "Angola",
    AI: "Anguilla",
    AQ: "Antarctica",
    AG: "Antigua and Barbuda",
    AR: "Argentina",
    AM: "Armenia",
    AW: "Aruba",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BS: "Bahamas",
    BH: "Bahrain",
    BD: "Bangladesh",
    BB: "Barbados",
    BY: "Belarus",
    BE: "Belgium",
    BZ: "Belize",
    BJ: "Benin",
    BM: "Bermuda",
    BT: "Bhutan",
    BO: "Bolivia",
    BA: "Bosnia and Herzegovina",
    BW: "Botswana",
    BR: "Brazil",
    BN: "Brunei",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    CV: "Cape Verde",
    KY: "Cayman Islands",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CO: "Colombia",
    KM: "Comoros",
    CG: "Congo",
    CR: "Costa Rica",
    HR: "Croatia",
    CU: "Cuba",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DK: "Denmark",
    DJ: "Djibouti",
    DM: "Dominica",
    DO: "Dominican Republic",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    EE: "Estonia",
    ET: "Ethiopia",
    FI: "Finland",
    FR: "France",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GR: "Greece",
    GT: "Guatemala",
    HT: "Haiti",
    HN: "Honduras",
    HK: "Hong Kong",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran",
    IQ: "Iraq",
    IE: "Ireland",
    IT: "Italy",
    JP: "Japan",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Laos",
    LV: "Latvia",
    LB: "Lebanon",
    LY: "Libya",
    LT: "Lithuania",
    LU: "Luxembourg",
    MY: "Malaysia",
    MV: "Maldives",
    MX: "Mexico",
    MD: "Moldova",
    MN: "Mongolia",
    MA: "Morocco",
    NL: "Netherlands",
    NZ: "New Zealand",
    NG: "Nigeria",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PA: "Panama",
    PE: "Peru",
    PH: "Philippines",
    PL: "Poland",
    PT: "Portugal",
    QA: "Qatar",
    RO: "Romania",
    RU: "Russia",
    SA: "Saudi Arabia",
    RS: "Serbia",
    SG: "Singapore",
    ZA: "South Africa",
    ES: "Spain",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syria",
    TH: "Thailand",
    TR: "Turkey",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    GB: "United Kingdom",
    US: "United States",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VE: "Venezuela",
    VN: "Vietnam",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe",
  };

  const searchInput = document.querySelector(".search-box__input");
  const searchButton = document.querySelector(".search-box__btn");

  const weathrDailyContainer = document.querySelector(".weathr-daily__grid");

  const baseUrl = "https://api.openweathermap.org/data/2.5";
  const apiKey = "0c74de3236eb4855294c992f0130cf03";
  const difulteCity = "tehran";

  const getWeather = async (endPoint = "weather", city) => {
    const url = `${baseUrl}/${endPoint}?q=${city}&units=metric&lang=en&appid=${apiKey}`;
    const resopns = await fetch(url);

    return resopns.json();
  };

  const showCurrntWeather = async (city) => {
    const currntWeathrContainer = document.querySelector(".weathr-box");

    const feelsLikeText = document.querySelector("#feelsLike");
    const humidityText = document.querySelector("#humidity");
    const windText = document.querySelector("#wind");
    const precipitationText = document.querySelector("#precipitation");

    const data = await getWeather("weather", city);
    const date = new Date().toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (+data.cod === 200) {
      const {
        name,
        weather: [{ icon }],
        main: { temp, feels_like, humidity },
        wind: { speed },
        snow,
        rain,
        sys: { country },
      } = data;

      const cityName =
        name !== countries[country] ? `${name}, ${countries[country]}` : name;

      const content = `
  <div>
      <h4 class="weathr-box__title">${cityName}</h4>
      <p class="weathr-box__text">${date}</p>
  </div>
  <div class="weathr-box__deg-box">
      <img src="./assets/images/icons/${icon}.svg" class="weathr-box__icon">
      <h2 class="weathr-box__deg">${Math.round(temp)}°</h2>
  </div>
  `;

      const precipitation = rain?.["1h"] || snow?.["1h"];

      currntWeathrContainer.innerHTML = content;
      feelsLikeText.innerHTML = `${Math.round(feels_like)}°`;
      humidityText.innerHTML = `${humidity}%`;
      windText.innerHTML = `${Math.round(speed * 3.6)} km/h`;
      precipitationText.innerHTML = `${precipitation || "0"} mm`;
    } else if (+data.cod === 404) {
      const content = `
    <div>
        <h4 class="weathr-box__title">City Not Found</h4>
        <p class="weathr-box__text">_</p>
    </div>
    `;
      currntWeathrContainer.innerHTML = content;
      feelsLikeText.innerHTML = `-`;
      humidityText.innerHTML = `-`;
      windText.innerHTML = `-`;
      precipitationText.innerHTML = `-`;
    }
  };

  const creatDaliyList = async (city) => {
    const data = await getWeather("forecast", city);

    if (+data.cod === 200) {
      const time = "12:00:00";
      const date = new Date().toISOString().split("T")[0];

      const { list } = data;
      const weatherList = list.filter(
        ({ dt_txt }) => dt_txt.includes(time) && !dt_txt.includes(date)
      );
      const todayWeather = list.find(({ dt_txt }) => dt_txt.includes(date));
      weatherList.unshift(todayWeather);

      const todayWeatherList = [];
      for (let i = 0; i < 8; i++) {
        todayWeatherList.push(list[i]);
      }

      showHuorsWeather(todayWeatherList);
      showDailyList(weatherList);
      setFoundLoadCssStyles();
    } else if (+data.cod === 404) {
      // خودم ننوشتمش نمیخواد این بخش رو در نظر بگیری
    }
  };

  const showHuorsWeather = async (weatherList) => {
    const huorboxs = document.querySelectorAll(".aside__box");
    const today = document.querySelector(".aside__selected");
    const dayName = new Date().toLocaleString("en-US", { weekday: "long" });

    today.innerHTML = dayName;

    let index = 0;
    for (const box of huorboxs) {
      const {
        weather: [{ icon }],
        main: { temp },
        dt_txt,
      } = weatherList[index];
      const hour = new Date(dt_txt).getHours();

      box.innerHTML = `
    <div class="aside__left-content">
      <img src="assets/images/icons/${icon}.svg" class="aside__icon">
      <div class="aside__title">${
        hour >= 12 ? `${hour % 12 || 12} PM` : `${hour || 12} AM`
      }</div>
    </div>
    <p class="aside__deg">${Math.round(temp)}°</p>
    `;
      box.classList.add("aside__box--loaded");
      index++;
    }
  };

  const showDailyList = (weatherList) => {
    weathrDailyContainer.innerHTML = "";
    weatherList.forEach((weatherData) => {
      const {
        weather: [{ icon }],
        main: { temp_max, temp_min },
        dt_txt,
      } = weatherData;
      const dayNameOption = { weekday: "short" };
      const dayName = new Date(dt_txt).toLocaleString("en-US", dayNameOption);

      weathrDailyContainer.insertAdjacentHTML(
        "beforeend",
        `
      <div class="weathr-daily__box">
          <p class="weathr-daily__title">${dayName}</p>
          <img src="./assets/images/icons/${icon}.svg" class="weathr-daily__icon">
          <div class="weathr-daily__deg-box">
              <p class="weathr-daily__max-deg">${Math.ceil(temp_max)}°</p>
              <p class="weathr-daily__min-deg">${Math.round(temp_min)}°</p>
          </div>
      </div>
      `
      );
    });
  };

  // const setWeatherIcon = (id) => {
  //   if (id <= 200) return `icon-storm.webp`;
  //   else if (id <= 300) return `icon-snow.webp`;
  //   else if (id <= 500) return `icon-rain.webp`;
  //   else if (id <= 600) return `icon-snow.webp`;
  //   else if (id <= 700) return `icon-fog.webp`;
  //   else if (id === 800) return `icon-sunny.webp`;
  //   else return `icon-partly-cloudy.webp`;
  // };

  const setFoundLoadCssStyles = () => {
    const weathrDailyElem = document.querySelector(".weathr-box");
    const weathrDailyTitle = document.querySelectorAll(".weathr-daily__title");
    const weathrDailyIcon = document.querySelectorAll(".weathr-daily__icon");
    const weathrDailyDegs = document.querySelectorAll(".weathr-daily__deg-box");
    weathrDailyElem.classList.remove("weathr-box--loading");
    [weathrDailyTitle, weathrDailyIcon, weathrDailyDegs].forEach((elems) =>
      elems.forEach((elem) => (elem.style.opacity = 1))
    );
  };

  const pageLoaded = (city) => {
    showCurrntWeather(city);
    creatDaliyList(city);
    searchInput.value = "";
  };

  searchInput.addEventListener("keydown", (e) => {
    const { key } = e;
    if (key === "Enter") pageLoaded(searchInput.value);
  });
  searchButton.addEventListener("click", () => {
    pageLoaded(searchInput.value);
  });

  const resopns = await fetch("https://ip-api.com/json/");
  const data = await resopns.json();
  const { city } = data;

  pageLoaded(city);
});

