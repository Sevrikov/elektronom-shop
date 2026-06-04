import type { ImageArbitrationConfig } from './image-arbitration';

export interface CategoryImageProfile {
  categoryId: string;
  categorySlug: string;
  categoryNameUk: string;
  categoryNameRu: string;
  params: ImageArbitrationConfig;
  calibratedAt: string;
  sampleStats: {
    totalSampled: number;
    qaPassed: number;
    passRatio: number;
  };
}

export const IMAGE_PROFILES: Record<string, CategoryImageProfile> = {
  "cwmhck2d0djlfy8pugk3mitx": {
    "categoryId": "cwmhck2d0djlfy8pugk3mitx",
    "categorySlug": "motornye-masla",
    "categoryNameUk": "Моторні мастила",
    "categoryNameRu": "Моторные масла",
    "params": {
      "distBlock": 0,
      "floorShadowY": 0.85,
      "minHoleSize": 99999
    },
    "calibratedAt": "2026-06-02T19:01:08.499Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "gn4c366ykvks6lzg17m57x0p": {
    "categoryId": "gn4c366ykvks6lzg17m57x0p",
    "categorySlug": "transmissionnye-masla",
    "categoryNameUk": "Трансмісійні мастила",
    "categoryNameRu": "Трансмиссионные масла",
    "params": {
      "distBlock": 0,
      "floorShadowY": 0.85,
      "minHoleSize": 99999
    },
    "calibratedAt": "2026-06-02T19:01:08.573Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "cwj5ua2hk1egfbb8fv5cc6gc": {
    "categoryId": "cwj5ua2hk1egfbb8fv5cc6gc",
    "categorySlug": "filtry",
    "categoryNameUk": "Фільтри",
    "categoryNameRu": "Фильтры",
    "params": {
      "distBlock": 0,
      "floorShadowY": 0.65,
      "minHoleSize": 99999,
      "tBot": 100,
      "outlineThreshMin": 95
    },
    "calibratedAt": "2026-06-02T19:01:08.791Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "esintpa2m8jz1wendrydi5nn": {
    "categoryId": "esintpa2m8jz1wendrydi5nn",
    "categorySlug": "elektrovymiryuvalni-prylady",
    "categoryNameUk": "Електровимірювальні прилади",
    "categoryNameRu": "Электроизмерительные приборы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:09.088Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "etiti46476qumpuyvhzo6spz": {
    "categoryId": "etiti46476qumpuyvhzo6spz",
    "categorySlug": "likhtaryky-svitlodiodni",
    "categoryNameUk": "Ліхтарики світлодіодні",
    "categoryNameRu": "Фонарики светодиодные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:09.551Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "akciy9mpze16og03tq85t3fe": {
    "categoryId": "akciy9mpze16og03tq85t3fe",
    "categorySlug": "ozonatory",
    "categoryNameUk": "Озонатори",
    "categoryNameRu": "Озонаторы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:09.707Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "cpuxczbl2lpyqhqq3p6uqxad": {
    "categoryId": "cpuxczbl2lpyqhqq3p6uqxad",
    "categorySlug": "taymery-rele-chasu",
    "categoryNameUk": "Таймери, реле часу",
    "categoryNameRu": "Таймеры, реле времени",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:10.008Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "ijt4cujzi8cwasbdg4pxpw3m": {
    "categoryId": "ijt4cujzi8cwasbdg4pxpw3m",
    "categorySlug": "dodatkove-obladnannya-na-din-reyku",
    "categoryNameUk": "Додаткове обладнання на DIN-рейку",
    "categoryNameRu": "Дополнительное оборудование на DIN-рейку",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:10.087Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "f7c77h2iflqc2ujrkdsabf18": {
    "categoryId": "f7c77h2iflqc2ujrkdsabf18",
    "categorySlug": "vylky-kauchukovi-seriyi-vk",
    "categoryNameUk": "Вилки каучукові серії ВК",
    "categoryNameRu": "Вилки каучуковые серии ВК",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:10.456Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "yym5rhll21dm377lk5dj60af": {
    "categoryId": "yym5rhll21dm377lk5dj60af",
    "categorySlug": "rozetky-kauchukovi-seriyi-rk",
    "categoryNameUk": "Розетки каучукові серії РК",
    "categoryNameRu": "Розетки каучуковые серии РК",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:10.532Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "ggmd6pl6yrwij174mqnzhehb": {
    "categoryId": "ggmd6pl6yrwij174mqnzhehb",
    "categorySlug": "kolodky-kauchukovi-z-zakhysnymy-kryshkamy-seriyi-kk",
    "categoryNameUk": "Колодки каучукові з захисними кришками серії КК",
    "categoryNameRu": "Колодки каучуковые с защитными крышками серии КК",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:10.615Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "rw4lu43bvonkm4x3wdfyjeq8": {
    "categoryId": "rw4lu43bvonkm4x3wdfyjeq8",
    "categorySlug": "rele-promizhni-seriy-my-mk-ly",
    "categoryNameUk": "Реле проміжні серій MY, MK, LY",
    "categoryNameRu": "Реле промежуточные серии MY, MK, LY",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:10.712Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ve32z5uu4cebgy1v70ww2dqe": {
    "categoryId": "ve32z5uu4cebgy1v70ww2dqe",
    "categorySlug": "kintsevi-vymykachi-seriyi-me",
    "categoryNameUk": "Кінцеві вимикачі серії МЕ",
    "categoryNameRu": "Конечные выключатели серии МЕ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:10.797Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "m5s3q0t0if1xr4fi486owxnf": {
    "categoryId": "m5s3q0t0if1xr4fi486owxnf",
    "categorySlug": "mikroperemykachi-seriy-d4mc-z-15-v-15",
    "categoryNameUk": "Мікроперемикачі серій D4MC, Z-15, V-15",
    "categoryNameRu": "Микропереключатели серий D4MC, Z-15, V-15",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:10.970Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mni65j8rvmoj1dbs0a9ih861": {
    "categoryId": "mni65j8rvmoj1dbs0a9ih861",
    "categorySlug": "peremykachi-klavishni",
    "categoryNameUk": "Перемикачі клавішні",
    "categoryNameRu": "Переключатели клавишные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:11.154Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "y4zc215b4hqcduu27tqu3z4w": {
    "categoryId": "y4zc215b4hqcduu27tqu3z4w",
    "categorySlug": "tsyfrovi-ampermetry-ta-voltmetry-seriyi-tsa-v",
    "categoryNameUk": "Цифрові амперметри та вольтметри серії ЦА(В)",
    "categoryNameRu": "Цифровые амперметры и вольтметры серии СА(В)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:11.493Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "hn7c7uqtsksn6zm39gfejhid": {
    "categoryId": "hn7c7uqtsksn6zm39gfejhid",
    "categorySlug": "tsyfrovi-ampermetry-ta-voltmetry-seriyi-tsa-v-lb",
    "categoryNameUk": "Цифрові амперметри та вольтметри серії ЦА(В)- LB",
    "categoryNameRu": "Цифровые амперметры и вольтметры серии ЦА(В) - LB",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:11.571Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "is1ruq1h6rt5avi9e7nur2gx": {
    "categoryId": "is1ruq1h6rt5avi9e7nur2gx",
    "categorySlug": "klemy-bezgvyntovi",
    "categoryNameUk": "Клеми безґвинтові",
    "categoryNameRu": "Клеммы безвинтовые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:11.981Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "xz0blddmnvfrriexe8wnkpmd": {
    "categoryId": "xz0blddmnvfrriexe8wnkpmd",
    "categorySlug": "din-reyky",
    "categoryNameUk": "DIN-рейки",
    "categoryNameRu": "DIN-рейки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:12.696Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "iqrnpa2je68998selyhjrzmx": {
    "categoryId": "iqrnpa2je68998selyhjrzmx",
    "categorySlug": "kabelne-markuvannya",
    "categoryNameUk": "Кабельне маркування",
    "categoryNameRu": "Кабельная маркировка",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:12.798Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "wz2gtyho6d4m54uxb7pegxf0": {
    "categoryId": "wz2gtyho6d4m54uxb7pegxf0",
    "categorySlug": "nakleyky-znaky-bezpeky",
    "categoryNameUk": "Наклейки Знаки безпеки",
    "categoryNameRu": "Наклейки Знаки безопасности",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:12.881Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "e7dmtvtkp3dj7a9sfn17i7pp": {
    "categoryId": "e7dmtvtkp3dj7a9sfn17i7pp",
    "categorySlug": "termozbizhni-rukavychky",
    "categoryNameUk": "Термозбіжні рукавички",
    "categoryNameRu": "Термоусаживаемые перчатки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:12.981Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "jmxuqqepk833ltq2x13n24t7": {
    "categoryId": "jmxuqqepk833ltq2x13n24t7",
    "categorySlug": "plastmasovi-koroby-kabel-kanaly",
    "categoryNameUk": "Пластмасові короби (кабель-канали)",
    "categoryNameRu": "Пластмассовые короба (кабель-каналы)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:13.070Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ph6da23u7b0a1e5anwc4j5gz": {
    "categoryId": "ph6da23u7b0a1e5anwc4j5gz",
    "categorySlug": "aksesuary-do-korobiv",
    "categoryNameUk": "Аксесуари до коробів",
    "categoryNameRu": "Аксессуары для коробов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:13.186Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "sz2andm06elob727n0dype5i": {
    "categoryId": "sz2andm06elob727n0dype5i",
    "categorySlug": "plastmasovi-pidlohovi-koroba",
    "categoryNameUk": "Пластмасові підлогові короба",
    "categoryNameRu": "Пластмассовые напольные короба",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:13.288Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "oocylu4kibb6pwv8wygd10ub": {
    "categoryId": "oocylu4kibb6pwv8wygd10ub",
    "categorySlug": "plastmasovi-pidlohovi-koroby-na-kleyoviy-osnovi",
    "categoryNameUk": "Пластмасові підлогові короби на клейовій основі",
    "categoryNameRu": "Пластмассовые напольные короба на клеевой основе",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:13.371Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "uh1kb8ydwueh8kax0rc0ji5n": {
    "categoryId": "uh1kb8ydwueh8kax0rc0ji5n",
    "categorySlug": "aksesuary-do-hladkykh-trub",
    "categoryNameUk": "Аксесуари до гладких труб",
    "categoryNameRu": "Аксессуары к гладким трубам",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:13.564Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "y84ah4jy01ratfpx5rj23h9l": {
    "categoryId": "y84ah4jy01ratfpx5rj23h9l",
    "categorySlug": "presy-hidravlichni-ruchni",
    "categoryNameUk": "Преси гідравлічні ручні",
    "categoryNameRu": "Прессы гидравлические ручные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:13.807Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "gcbh9b1w7g0v3vfk4q2k63p8": {
    "categoryId": "gcbh9b1w7g0v3vfk4q2k63p8",
    "categorySlug": "instrument-dlya-merezhevykh-robit",
    "categoryNameUk": "Інструмент для мережевих робіт",
    "categoryNameRu": "Инструмент для сетевых работ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:13.887Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "upxvjs80l6en25hc3ut276rs": {
    "categoryId": "upxvjs80l6en25hc3ut276rs",
    "categorySlug": "universalnyy-instrument",
    "categoryNameUk": "Універсальний інструмент",
    "categoryNameRu": "Универсальный инструмент",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:14.177Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "z7wqwxtb68lfpizqsgte1i62": {
    "categoryId": "z7wqwxtb68lfpizqsgte1i62",
    "categorySlug": "pozytsionery-dlya-zvaryuvalnykh-robit",
    "categoryNameUk": "Позиціонери для зварювальних робіт",
    "categoryNameRu": "Позиционеры для сварочных работ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:14.405Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "w1vts89fhrx3ejy7ddlxf42y": {
    "categoryId": "w1vts89fhrx3ejy7ddlxf42y",
    "categorySlug": "trymachi-dlya-instrumentu",
    "categoryNameUk": "Тримачі для інструменту",
    "categoryNameRu": "Держатели для инструмента",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:14.486Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "itmg1nxkinu0z5w6sv4h6xfe": {
    "categoryId": "itmg1nxkinu0z5w6sv4h6xfe",
    "categorySlug": "zakhopy",
    "categoryNameUk": "Захопи",
    "categoryNameRu": "Захваты",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:14.562Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "xyja0kv4cx8n8vb064bt2p9z": {
    "categoryId": "xyja0kv4cx8n8vb064bt2p9z",
    "categorySlug": "mahnitni-yemnosti",
    "categoryNameUk": "Магнітні ємності",
    "categoryNameRu": "Магнитные емкости",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:14.679Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "pxqkw32bq0pwykq2s3vylxeg": {
    "categoryId": "pxqkw32bq0pwykq2s3vylxeg",
    "categorySlug": "mahnitni-trymachi-z-peremykachem",
    "categoryNameUk": "Магнітні тримачі з перемикачем",
    "categoryNameRu": "Магнитные держатели с переключателем",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:14.826Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "ujkufts57r2bpk5yrnnmm3kn": {
    "categoryId": "ujkufts57r2bpk5yrnnmm3kn",
    "categorySlug": "dekoratyvni-elementy",
    "categoryNameUk": "Декоративні елементи",
    "categoryNameRu": "Декоративные элементы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:15.039Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "fzjm9u1lxyzys708p5adg98d": {
    "categoryId": "fzjm9u1lxyzys708p5adg98d",
    "categorySlug": "infrachervoni-datchyky-rukhu",
    "categoryNameUk": "Інфрачервоні датчики руху",
    "categoryNameRu": "Инфракрасные датчики движения",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:15.327Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "v12mlus6h1cdmg10sjw9o0fd": {
    "categoryId": "v12mlus6h1cdmg10sjw9o0fd",
    "categorySlug": "datchyky-osvitlenosti",
    "categoryNameUk": "Датчики освітленості",
    "categoryNameRu": "Датчики освещенности",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:15.403Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "cdderbh6xcxk7glzqm4lfdbm": {
    "categoryId": "cdderbh6xcxk7glzqm4lfdbm",
    "categorySlug": "3-0-1-5",
    "categoryNameUk": "3,0/1,5",
    "categoryNameRu": "3,0/1,5",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:15.480Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "o32900nlmqcto3nop5qwl6el": {
    "categoryId": "o32900nlmqcto3nop5qwl6el",
    "categorySlug": "avtomatychni-vymykachi-seriyi-ukrem-va-2003",
    "categoryNameUk": "Автоматичні вимикачі серії УКРЕМ ВА-2003",
    "categoryNameRu": "Автоматические выключатели серии УКРЕМ ВА-2003",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:15.641Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "do2mkg0o6mjmwps1syo5lszu": {
    "categoryId": "do2mkg0o6mjmwps1syo5lszu",
    "categorySlug": "dyferentsialni-avtomatychni-vymykachi-iz-zakhystom-vid-nadstrumu-dv",
    "categoryNameUk": "Диференціальні автоматичні вимикачі із захистом від надструму (ДВ)",
    "categoryNameRu": "Дифференциальные автоматические выключатели с защитой от сверхтока (ДВ)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:15.725Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "xkweihpuj700grbeg7978xpv": {
    "categoryId": "xkweihpuj700grbeg7978xpv",
    "categorySlug": "modulni-kontaktory-seriyi-mk-n",
    "categoryNameUk": "Модульні Контактори серії МК-N",
    "categoryNameRu": "Контакторы модульные серии МК-N",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:15.805Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ejrv14z8x36b5yfqmhp9j2rz": {
    "categoryId": "ejrv14z8x36b5yfqmhp9j2rz",
    "categorySlug": "dodatkovi-kontakty-o-f-do-modulnykh-kontaktoriv-mk-n",
    "categoryNameUk": "Додаткові контакти O+F до модульних контакторів МК-N",
    "categoryNameRu": "Дополнительные контакты О+F к модульным контакторам МК-N",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:15.875Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "pmddhr0hy8qqcqf9w9vhi0m2": {
    "categoryId": "pmddhr0hy8qqcqf9w9vhi0m2",
    "categorySlug": "vymykachi-roz-yem-roz-yednuvachi-seriyi-va-2007-vrn",
    "categoryNameUk": "Вимикачі-роз'єм роз'єднувачі серії ВА-2007-ВРН",
    "categoryNameRu": "Выключатели-розъединители серии ВА-2007-ВРН",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:15.953Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ik074sr1ty75zz6615tueusi": {
    "categoryId": "ik074sr1ty75zz6615tueusi",
    "categorySlug": "taymer-elektronno-mekhanichnyy-dobovyy-sul181h",
    "categoryNameUk": "Таймер електронно-механічний, добовий SUL181h",
    "categoryNameRu": "Таймер электронно-механический, суточный SUL181h",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.049Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "umxi0o6bliytwed0owjoxofj": {
    "categoryId": "umxi0o6bliytwed0owjoxofj",
    "categorySlug": "taymer-elektronnyy-tyzhnevyy-tns15-tz",
    "categoryNameUk": "Таймер електронний, тижневий ТНС15(-ТЗ)",
    "categoryNameRu": "Таймер электронный, недельный ТНС15(-ТС)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.121Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "gxapftbgdqqazgzd20yezqnc": {
    "categoryId": "gxapftbgdqqazgzd20yezqnc",
    "categorySlug": "rele-chasu-nte8",
    "categoryNameUk": "Реле часу NTE8",
    "categoryNameRu": "Реле времени NTE8",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.198Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "xozn5emo8lxqfezefnu32cbo": {
    "categoryId": "xozn5emo8lxqfezefnu32cbo",
    "categorySlug": "sylovi-avtomatychni-vymykachi-seriyi-va-2004n-asko-ukrem",
    "categoryNameUk": "Силові автоматичні вимикачі серії ВА-2004N АСКО УКРЕМ",
    "categoryNameRu": "Силовые автоматические выключатели серии ВА-2004N АСКО УКРЕМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.277Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "fugj4loswyfm2ea7doazpd14": {
    "categoryId": "fugj4loswyfm2ea7doazpd14",
    "categorySlug": "avtomatychni-vymykachi-zakhystu-dvyhuna-seriyi-va-2005",
    "categoryNameUk": "Автоматичні вимикачі захисту двигуна серії ВА-2005",
    "categoryNameRu": "Автоматические выключатели защиты двигателя серии ВА-2005",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.353Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "c9bgchdrinleu63itbi3dvax": {
    "categoryId": "c9bgchdrinleu63itbi3dvax",
    "categorySlug": "osnovy-z-trymachamy-zapobizhnykiv-znimach",
    "categoryNameUk": "Основи з тримачами запобіжників, знімач",
    "categoryNameRu": "Основы с держателями предохранителей, съемник",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.432Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "pnw9y2d5zo6uu93zelv0tlt4": {
    "categoryId": "pnw9y2d5zo6uu93zelv0tlt4",
    "categorySlug": "kontaktory-miniatyurni-seriyi-pm0",
    "categoryNameUk": "Контактори мініатюрні серії ПМ0",
    "categoryNameRu": "Контакторы миниатюрные серии ПМ0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.510Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "wk7posdnuett0eflrtyc7doh": {
    "categoryId": "wk7posdnuett0eflrtyc7doh",
    "categorySlug": "kontaktory-malohabarytni-seriyi-pm",
    "categoryNameUk": "Контактори малогабаритні серії ПМ",
    "categoryNameRu": "Контакторы малогабаритные серии ПМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.592Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ll1kexnrduox368pxl741570": {
    "categoryId": "ll1kexnrduox368pxl741570",
    "categorySlug": "kontaktory-seriyi-km",
    "categoryNameUk": "Контактори серії КМ",
    "categoryNameRu": "Контакторы серии КМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.709Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "qorcv2wxq8fvyjojdg60u2ph": {
    "categoryId": "qorcv2wxq8fvyjojdg60u2ph",
    "categorySlug": "puskachi-v-korpusi-seriyi-pmk",
    "categoryNameUk": "Пускачі в корпусі серії ПМК",
    "categoryNameRu": "Пускатели в корпусе серии ПМК",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.789Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "m6oykgvh1vx418x9mb80iogn": {
    "categoryId": "m6oykgvh1vx418x9mb80iogn",
    "categorySlug": "dodatkovi-kontakty-dk",
    "categoryNameUk": "Додаткові контакти ДК",
    "categoryNameRu": "Дополнительные контакты ДК",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.866Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "f6shgahl8lpm7bt1javvhoa6": {
    "categoryId": "f6shgahl8lpm7bt1javvhoa6",
    "categorySlug": "blok-zatrymky-bz",
    "categoryNameUk": "Блок затримки БЗ",
    "categoryNameRu": "Блок задержки БЗ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:16.951Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "g0p4364futpu51p2ofsy46ru": {
    "categoryId": "g0p4364futpu51p2ofsy46ru",
    "categorySlug": "revers-komplekty",
    "categoryNameUk": "Реверс-комплекти",
    "categoryNameRu": "Реверс-комплекты",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:17.027Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "t3b1kz81cj7ona8ywdxfda2t": {
    "categoryId": "t3b1kz81cj7ona8ywdxfda2t",
    "categorySlug": "teplovi-rele-seriyi-rt",
    "categoryNameUk": "Теплові реле серії РТ",
    "categoryNameRu": "Тепловые реле серии РТ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:17.105Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "c5300dsyr02x4fjznhztn1fv": {
    "categoryId": "c5300dsyr02x4fjznhztn1fv",
    "categorySlug": "roz-yem-roz-yednuvachi-seriyi-qs5",
    "categoryNameUk": "Роз'єм роз'єднувачі серії QS5",
    "categoryNameRu": "Разъединители серии QS5",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:17.186Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "g7iswc6y141pfke20bvc1qgs": {
    "categoryId": "g7iswc6y141pfke20bvc1qgs",
    "categorySlug": "paketni-peremykachi-seriyi-pkp-e9",
    "categoryNameUk": "Пакетні перемикачі серії ПКП Е9",
    "categoryNameRu": "Пакетные переключатели серии ПКП Е9",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:17.265Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "a5jijq0m6ii5646rqi6bl3ea": {
    "categoryId": "a5jijq0m6ii5646rqi6bl3ea",
    "categorySlug": "paketni-peremykachi-seriyi-pkp-sbi",
    "categoryNameUk": "Пакетні перемикачі серії ПКП SBI",
    "categoryNameRu": "Пакетные переключатели серии ПКП SBI",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:17.344Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ok2y5bdmsji1x6zc31vc40b4": {
    "categoryId": "ok2y5bdmsji1x6zc31vc40b4",
    "categorySlug": "miniatyurni-tumblery",
    "categoryNameUk": "Мініатюрні тумблери",
    "categoryNameRu": "Миниатюрные тумблеры",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:17.488Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mauzfblwydra67vh6dbg6v9n": {
    "categoryId": "mauzfblwydra67vh6dbg6v9n",
    "categorySlug": "seriyi-khv2",
    "categoryNameUk": "Серії ХВ2",
    "categoryNameRu": "Серии ХВ2",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:17.568Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "z5e5q4qliul8zcm63jr7l3d8": {
    "categoryId": "z5e5q4qliul8zcm63jr7l3d8",
    "categorySlug": "seryy-tb5",
    "categoryNameUk": "Серии TB5",
    "categoryNameRu": "Серии TB5",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:17.773Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "d6rn4allf5rcyspomc4n71er": {
    "categoryId": "d6rn4allf5rcyspomc4n71er",
    "categorySlug": "seriyi-ty-j-antyvandalni",
    "categoryNameUk": "Серії TY(J) (Антивандальні )",
    "categoryNameRu": "Серии TY(J) (Антивандальные)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:18.719Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "qcpedft6z13mzdfcqfvt5frd": {
    "categoryId": "qcpedft6z13mzdfcqfvt5frd",
    "categorySlug": "seriyi-xb2-e",
    "categoryNameUk": "Серії XB2-E",
    "categoryNameRu": "Серии XB2-E",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:19.436Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ha0foackfwm42f7adazopek3": {
    "categoryId": "ha0foackfwm42f7adazopek3",
    "categorySlug": "seriyi-sov",
    "categoryNameUk": "Серії СОВ",
    "categoryNameRu": "Серии СОВ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:20.404Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "lwwbd6stv7inqxs1zc4zmbl0": {
    "categoryId": "lwwbd6stv7inqxs1zc4zmbl0",
    "categorySlug": "seriyi-xal-b3",
    "categoryNameUk": "Серії XAL-B3",
    "categoryNameRu": "Серии XAL-B3",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:21.423Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "wcofci4wl1liwicqld6cflq4": {
    "categoryId": "wcofci4wl1liwicqld6cflq4",
    "categorySlug": "seriyi-xal-b-j",
    "categoryNameUk": "Серії XAL-B, J",
    "categoryNameRu": "Серии XAL-B, J",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:22.187Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "rgjhjct5gks1wl3zl3nfc1gd": {
    "categoryId": "rgjhjct5gks1wl3zl3nfc1gd",
    "categorySlug": "seriyi-xal-d",
    "categoryNameUk": "Серії XAL-D",
    "categoryNameRu": "Серии XAL-D",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:22.997Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ljewb7tgdccbegwrmmiggohb": {
    "categoryId": "ljewb7tgdccbegwrmmiggohb",
    "categorySlug": "korpusy-knopkovykh-postiv-seriyi-hj-9",
    "categoryNameUk": "Корпуси кнопкових постів серії HJ-9",
    "categoryNameRu": "Корпуса кнопочных постов серии HJ-9",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:23.120Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "falhh0ydj0zmmxsl68wfapbb": {
    "categoryId": "falhh0ydj0zmmxsl68wfapbb",
    "categorySlug": "svitlosyhnalna-ta-zvukova-armatura-seriyi-ad16-22",
    "categoryNameUk": "Світлосигнальна та звукова арматура серії AD16, 22",
    "categoryNameRu": "Светосигнальная и звуковая арматура серии AD16, 22",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:23.252Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "rfcybyt5mj0r3k4qv0ccedum": {
    "categoryId": "rfcybyt5mj0r3k4qv0ccedum",
    "categorySlug": "svitlosyhnalna-armatura-seriyi-ad22c-ad22b-c",
    "categoryNameUk": "Світлосигнальна арматура серії AD22C, AD22B, C",
    "categoryNameRu": "Светосигнальная арматура серии AD22C, AD22B, C",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:23.395Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "kmr9fldu36m7pfije1mfd7fb": {
    "categoryId": "kmr9fldu36m7pfije1mfd7fb",
    "categorySlug": "svitlosyhnalna-armatura-seriyi-ad22e",
    "categoryNameUk": "Світлосигнальна арматура серії AD22E",
    "categoryNameRu": "Светосигнальная арматура серии AD22E",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:23.540Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "swjic3mdkltg7x0ww7m1lq8f": {
    "categoryId": "swjic3mdkltg7x0ww7m1lq8f",
    "categorySlug": "svitlosyhnalna-armatura-seriyi-tyf08f",
    "categoryNameUk": "Світлосигнальна арматура серії TYF08F",
    "categoryNameRu": "Светосигнальная арматура серии TYF08F",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:23.675Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "kfq1vb8pajgqf67x88vwzhb8": {
    "categoryId": "kfq1vb8pajgqf67x88vwzhb8",
    "categorySlug": "dzvinky-huchnoho-boyu-seriyi-ebl",
    "categoryNameUk": "Дзвінки гучного бою серії EBL",
    "categoryNameRu": "Звонки громкого боя серии EBL",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:23.786Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "x9wh55mqm34900k0a1gwuers": {
    "categoryId": "x9wh55mqm34900k0a1gwuers",
    "categorySlug": "voltmetry-analohovi",
    "categoryNameUk": "Вольтметри аналогові",
    "categoryNameRu": "Вольтметры аналоговые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:23.952Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "hb227e6ursvva4cgtu36xtvy": {
    "categoryId": "hb227e6ursvva4cgtu36xtvy",
    "categorySlug": "komplektuyuchi-vymiryuvalnykh-pryladiv",
    "categoryNameUk": "Комплектуючі вимірювальних приладів",
    "categoryNameRu": "Комплектующие измерительных приборов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:24.147Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "yjdcv4b878f0acdqos6y2pqt": {
    "categoryId": "yjdcv4b878f0acdqos6y2pqt",
    "categorySlug": "tsyfrovi-voltmetry-seriyi-ad22-22dvm",
    "categoryNameUk": "Цифрові вольтметри серії AD22-22DVM",
    "categoryNameRu": "Цифровые вольтметры серии AD22-22DVM",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:24.361Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "j7xwo0ler3nso2e5rkz5s1sq": {
    "categoryId": "j7xwo0ler3nso2e5rkz5s1sq",
    "categorySlug": "nakonechnyky-bez-izolyatsiyi",
    "categoryNameUk": "Наконечники без ізоляції",
    "categoryNameRu": "Наконечники без изоляции",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:24.685Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "nns9p44za7g94bjyrl1finy5": {
    "categoryId": "nns9p44za7g94bjyrl1finy5",
    "categorySlug": "nabory-nakonechnykiv-dlya-kabeliv-ta-provodiv",
    "categoryNameUk": "Набори наконечників для кабелів та проводів",
    "categoryNameRu": "Наборы наконечников для кабелей и проводов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:24.821Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "sb4vnr1x31c34p4rv41d5ewc": {
    "categoryId": "sb4vnr1x31c34p4rv41d5ewc",
    "categorySlug": "shyny-z-yednannya-yednuvalni",
    "categoryNameUk": "Шини з'єднання єднувальні",
    "categoryNameRu": "Шины соединительные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:24.966Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "szj752pygw57esw8zaq1g92q": {
    "categoryId": "szj752pygw57esw8zaq1g92q",
    "categorySlug": "izolyator-trymach-sylovoyi-shyny-seriyi-sm",
    "categoryNameUk": "Ізолятор-тримач силової шини серії SM",
    "categoryNameRu": "Изолятор-держатель силовой шины серии SM",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:25.042Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "ymggvpk40hx08kzavpxpgtk5": {
    "categoryId": "ymggvpk40hx08kzavpxpgtk5",
    "categorySlug": "gvyntovi-kontaktni-zatyskachi-na-din-reyku-seriyi-jxb",
    "categoryNameUk": "Ґвинтові контактні затискачі на DIN-рейку серії JXB",
    "categoryNameRu": "Винтовые контактные зажимы на DIN-рейке серии JXB",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:25.122Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "q54yclhj4l69g781t6fl82fp": {
    "categoryId": "q54yclhj4l69g781t6fl82fp",
    "categorySlug": "klemni-kolodky-seriyi-tv",
    "categoryNameUk": "Клемні колодки серії ТВ",
    "categoryNameRu": "Клеммные колодки серии ТВ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:25.270Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "pd0x2bg4718ezwz1h7quh5rp": {
    "categoryId": "pd0x2bg4718ezwz1h7quh5rp",
    "categorySlug": "klemni-kolodky-seriyi-ms",
    "categoryNameUk": "Клемні колодки серії МС",
    "categoryNameRu": "Клеммные колодки серии ТC",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:25.343Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "jokp910cr3beef70dpfecikr": {
    "categoryId": "jokp910cr3beef70dpfecikr",
    "categorySlug": "klemni-kolodky-12-parni-seriyi-w-u",
    "categoryNameUk": "Клемні колодки 12-парні серії W (U)",
    "categoryNameRu": "Клеммные колодки 12-парные серии W(U)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:25.418Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "er990rtnpbm8a8uag5wmay7j": {
    "categoryId": "er990rtnpbm8a8uag5wmay7j",
    "categorySlug": "klemni-kolodky-12-parni-seriyi-n",
    "categoryNameUk": "Клемні колодки 12-парні серії Н",
    "categoryNameRu": "Клеммные колодки 12-парные серии Н",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:25.493Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "o3u6pifx8a0u8p8zl1jl0k75": {
    "categoryId": "o3u6pifx8a0u8p8zl1jl0k75",
    "categorySlug": "klema-z-yednannya-yednuvalna-universalnana-din-reyku-pct-211",
    "categoryNameUk": "Клема з'єднання єднувальна універсальнана DIN-рейку PCT-211",
    "categoryNameRu": "Клемма соединительная универсальная DIN-рейку PCT-211",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:25.640Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "nzvwmbrequp46lpo427qph4g": {
    "categoryId": "nzvwmbrequp46lpo427qph4g",
    "categorySlug": "aksesuary-do-klemy-rst-111",
    "categoryNameUk": "Аксесуари до клеми РСТ-111",
    "categoryNameRu": "Аксесуари до клеми РСТ-111",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:25.710Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "x9fbjo65iduyk7vchnthh34e": {
    "categoryId": "x9fbjo65iduyk7vchnthh34e",
    "categorySlug": "klemnyk-z-yednannya-yednuvalnyy-smk-10kh",
    "categoryNameUk": "Клемник з'єднання єднувальний СМК-10х",
    "categoryNameRu": "Клеммник соединительный СМК-10х",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:25.852Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "trrl5ttn2za02ue70h41cj61": {
    "categoryId": "trrl5ttn2za02ue70h41cj61",
    "categorySlug": "klemnyk-z-yednannya-yednuvalnyy-smk-25khkh",
    "categoryNameUk": "Клемник з'єднання єднувальний СМК-25хХ",
    "categoryNameRu": "Клеммник соединительный СМК-25хХ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:25.926Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "c4vgjof4ynn5u2evwj16h20s": {
    "categoryId": "c4vgjof4ynn5u2evwj16h20s",
    "categorySlug": "klemy-z-yednannya-yednuvalni-universalni-seriyi-as-smk",
    "categoryNameUk": "Клеми з'єднання єднувальні універсальні серії АС, СМК",
    "categoryNameRu": "Клеммы соединительные универсальные серии AСС, СМК",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:25.999Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "sq9o1lbocfs9f1pr1rmeoec0": {
    "categoryId": "sq9o1lbocfs9f1pr1rmeoec0",
    "categorySlug": "klema-z-yednannya-yednuvalna-universalna-smk-61kh",
    "categoryNameUk": "Клема з'єднання єднувальна універсальна СМК-61х",
    "categoryNameRu": "Клемма соединительная универсальная СМК-61х",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:26.070Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "sdl1t4fc2cymkj9haauo9vzm": {
    "categoryId": "sdl1t4fc2cymkj9haauo9vzm",
    "categorySlug": "klemnyk-zatysknyy-z-yednannya-yednuvalnyy-smk-823",
    "categoryNameUk": "Клемник затискний з'єднання єднувальний СМК-823",
    "categoryNameRu": "Клеммник зажимной соединительный СМК-823",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:26.141Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "tdvfc9gks4ag8kqsjfzydvsj": {
    "categoryId": "tdvfc9gks4ag8kqsjfzydvsj",
    "categorySlug": "klemnyk-z-yednannya-dlya-svitylnykiv-cmk-1xx",
    "categoryNameUk": "Клемник з'єднання для світильників CMK-1xx",
    "categoryNameRu": "Клеммник соединительный для светильников CMK-1xx",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:26.211Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "y2lg1l1wpumkkp630acet6bm": {
    "categoryId": "y2lg1l1wpumkkp630acet6bm",
    "categorySlug": "klemy-z-yednannya-yednuvalni-universalni-prokhidni-seriyi-db",
    "categoryNameUk": "Клеми з'єднання єднувальні універсальні прохідні серії DB",
    "categoryNameRu": "Клеммы универсальные проходные серии DB",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:26.285Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "h8rx03z2r5t31j50z728gqpl": {
    "categoryId": "h8rx03z2r5t31j50z728gqpl",
    "categorySlug": "kovpachky-kintsevi-seriyi-s",
    "categoryNameUk": "Ковпачки кінцеві серії S",
    "categoryNameRu": "Колпачки концевые серии S",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:26.358Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "dkmra9kws7grh4zrmmlf80at": {
    "categoryId": "dkmra9kws7grh4zrmmlf80at",
    "categorySlug": "izolyatsiyni-kovpachky-dlya-skrutok-provodu-seriyi-r",
    "categoryNameUk": "Ізоляційні ковпачки для скруток проводу серії Р",
    "categoryNameRu": "Изоляционные колпачки для сверток провода серии Р",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:26.431Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "v8hukpfxvmtej9bfcrnqp33x": {
    "categoryId": "v8hukpfxvmtej9bfcrnqp33x",
    "categorySlug": "salnyky-seriyi-pg",
    "categoryNameUk": "Сальники серії PG",
    "categoryNameRu": "Сальники серии PG",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:26.508Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "x9xbff29l65i2qnoqbkl7fde": {
    "categoryId": "x9xbff29l65i2qnoqbkl7fde",
    "categorySlug": "humovi-salnyky",
    "categoryNameUk": "Гумові Сальники",
    "categoryNameRu": "Сальники резиновые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:26.580Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "hwfkphykjyjyq3057qq6wy8e": {
    "categoryId": "hwfkphykjyjyq3057qq6wy8e",
    "categorySlug": "montazhni-korobky-standartni",
    "categoryNameUk": "Монтажні коробки стандартні",
    "categoryNameRu": "Монтажные коробки стандартные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:26.939Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "ygfno1xwoy91axcosaaj07lq": {
    "categoryId": "ygfno1xwoy91axcosaaj07lq",
    "categorySlug": "termozbizhna-trubka",
    "categoryNameUk": "Термозбіжна трубка",
    "categoryNameRu": "Термоусадочная трубка",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:27.021Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "xeksv6qgru4khyarnas5bwpa": {
    "categoryId": "xeksv6qgru4khyarnas5bwpa",
    "categorySlug": "nabory-trubky",
    "categoryNameUk": "Набори трубки",
    "categoryNameRu": "Наборы трубки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:27.091Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "wyt5is3jp5j1bz4764ot0muu": {
    "categoryId": "wyt5is3jp5j1bz4764ot0muu",
    "categorySlug": "z-kleyem",
    "categoryNameUk": "З клеєм",
    "categoryNameRu": "Термоусадка на клеевой основе",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:27.164Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "d3ko24ccnsclkzp1vll5a7w9": {
    "categoryId": "d3ko24ccnsclkzp1vll5a7w9",
    "categorySlug": "zvychayni",
    "categoryNameUk": "Звичайні",
    "categoryNameRu": "Обычные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:27.234Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "diquzpsivqdcxvfbyv58hj9l": {
    "categoryId": "diquzpsivqdcxvfbyv58hj9l",
    "categorySlug": "z-rozshyrennyam",
    "categoryNameUk": "З розширенням",
    "categoryNameRu": "С расширением",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:27.307Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "l8a08httxbiqtteskxrec0sv": {
    "categoryId": "l8a08httxbiqtteskxrec0sv",
    "categorySlug": "svetl-y-klass",
    "categoryNameUk": "Светлый класс",
    "categoryNameRu": "Светлый класс",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:27.450Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "z6z5ec3iptr85a713ip9in2t": {
    "categoryId": "z6z5ec3iptr85a713ip9in2t",
    "categorySlug": "dlya-opresovuvannya-izolovanykh-ta-neizolovanykh-nakonechnykiv-ta-hilz",
    "categoryNameUk": "Для опресовування ізольованих та неізольованих наконечників та гільз",
    "categoryNameRu": "Для опрессовки изолированных и неизолированных наконечников и гильз",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:27.671Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "qzfs8yis41cf3z30p7uofejz": {
    "categoryId": "qzfs8yis41cf3z30p7uofejz",
    "categorySlug": "provodiv",
    "categoryNameUk": "Проводів",
    "categoryNameRu": "Проводов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:27.812Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "jgo82ywi4fkb16m9i05w50m4": {
    "categoryId": "jgo82ywi4fkb16m9i05w50m4",
    "categorySlug": "stalnykh-trosiv",
    "categoryNameUk": "Стальних тросів",
    "categoryNameRu": "Стальных тросов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:27.959Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "zym3vewe08w81vp2avj4d0jb": {
    "categoryId": "zym3vewe08w81vp2avj4d0jb",
    "categorySlug": "ruchnyy-instrument-dlya-rizannya-din-reyky-ns-10",
    "categoryNameUk": "Ручний інструмент для різання DIN-рейки NS-10",
    "categoryNameRu": "Ручной инструмент для резки DIN-рейки NS-10",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:28.032Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "adslmgc7knc32mkba5yucur4": {
    "categoryId": "adslmgc7knc32mkba5yucur4",
    "categorySlug": "mekhanichnyy",
    "categoryNameUk": "Механічний",
    "categoryNameRu": "Механический",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:28.172Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "oe056q104cgiwqe69ejx4iea": {
    "categoryId": "oe056q104cgiwqe69ejx4iea",
    "categorySlug": "hidravlichnyy-ruchnyy",
    "categoryNameUk": "Гідравлічний ручний",
    "categoryNameRu": "Гидравлический ручной",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:28.248Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "imto42u5bcae2m27tzpfumaa": {
    "categoryId": "imto42u5bcae2m27tzpfumaa",
    "categorySlug": "z-kabelyu",
    "categoryNameUk": "З кабелю",
    "categoryNameRu": "С кабеля",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:28.318Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "c545kt9ldxhs6t4purt9zwg7": {
    "categoryId": "c545kt9ldxhs6t4purt9zwg7",
    "categorySlug": "z-drotu",
    "categoryNameUk": "З дроту",
    "categoryNameRu": "С провода",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:28.393Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "p8x13916f7tkqp3es1dob3dk": {
    "categoryId": "p8x13916f7tkqp3es1dob3dk",
    "categorySlug": "dlya-prosichnoho-instrumentu",
    "categoryNameUk": "Для просічного інструменту",
    "categoryNameRu": "Для просечного инструмента",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:28.464Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "u737g2zlob5rjdf3lx69vdsv": {
    "categoryId": "u737g2zlob5rjdf3lx69vdsv",
    "categorySlug": "seriya-fl-1",
    "categoryNameUk": "Серія Fl",
    "categoryNameRu": "Серия Fl",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:28.755Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "yecocsxgly5khx141m6h92tu": {
    "categoryId": "yecocsxgly5khx141m6h92tu",
    "categorySlug": "seriya-ct-1",
    "categoryNameUk": "Серія Ct",
    "categoryNameRu": "Серия Ct",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:28.827Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "gyqdj5ybidqs7kp9jq90fnyo": {
    "categoryId": "gyqdj5ybidqs7kp9jq90fnyo",
    "categorySlug": "solovi-elementy-zhyvlennya",
    "categoryNameUk": "Сольові елементи живлення",
    "categoryNameRu": "Солевые элементы питания",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:28.909Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "dmymf4n4oaxtiib3d5nd4ifj": {
    "categoryId": "dmymf4n4oaxtiib3d5nd4ifj",
    "categorySlug": "luzhni-elementy-zhyvlennya",
    "categoryNameUk": "Лужні елементи живлення",
    "categoryNameRu": "Щелочные элементы питания",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:29.012Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "esvjmqi1m6lc3gowieawgbwf": {
    "categoryId": "esvjmqi1m6lc3gowieawgbwf",
    "categorySlug": "litiyevi-dyskovi-elementy-zhyvlennya-tabletky",
    "categoryNameUk": "Літієві дискові елементи живлення \"таблетки\"",
    "categoryNameRu": "Литиевые дисковые элементы питания \"таблетки\"",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:29.082Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "dwgigwmzbmkw7emoxxklqy6j": {
    "categoryId": "dwgigwmzbmkw7emoxxklqy6j",
    "categorySlug": "vylky-perenosni-seriyi-vp",
    "categoryNameUk": "Вилки переносні серії ВП",
    "categoryNameRu": "Вилки переносные серии ВП",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:29.307Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "txt6ybruaegnvs4n0rf5s46v": {
    "categoryId": "txt6ybruaegnvs4n0rf5s46v",
    "categorySlug": "rozetky-perenosni-seriyi-hp",
    "categoryNameUk": "Розетки переносні серії ГП",
    "categoryNameRu": "Розетки переносные серии ГП",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:29.381Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "ffn6a4azhqzk2z9izf67p2he": {
    "categoryId": "ffn6a4azhqzk2z9izf67p2he",
    "categorySlug": "vylky-statsionarni-seriyi-vs",
    "categoryNameUk": "Вилки стаціонарні серії ВС",
    "categoryNameRu": "Вилки стационарные серии ВС",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:29.451Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "r93jf18b4oa8vjpgsjttozxs": {
    "categoryId": "r93jf18b4oa8vjpgsjttozxs",
    "categorySlug": "rozetky-statsionarni-seriyi-hs",
    "categoryNameUk": "Розетки стаціонарні серії ГС",
    "categoryNameRu": "Розетки стационарные серии ГС",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:29.526Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "xx9tpwvbz0q7w9uy4i5q2lc6": {
    "categoryId": "xx9tpwvbz0q7w9uy4i5q2lc6",
    "categorySlug": "roz-yem-ob-yemy-typu-schuko",
    "categoryNameUk": "Роз'єм об'єми типу «Schuko»",
    "categoryNameRu": "Разъемы типа «Schuko»",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:29.600Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "ee4t1tbba2cocbsumbxh6lt9": {
    "categoryId": "ee4t1tbba2cocbsumbxh6lt9",
    "categorySlug": "tsyfrovyy-termometr-ed16-22wd",
    "categoryNameUk": "Цифровий термометр ED16-22WD",
    "categoryNameRu": "Цифровой термометр ED16-22WD",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:29.883Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "oaequgdzsao6cj9kl6e2rb4e": {
    "categoryId": "oaequgdzsao6cj9kl6e2rb4e",
    "categorySlug": "4-0-2-0",
    "categoryNameUk": "4,0/2,0",
    "categoryNameRu": "4,0/2,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:29.955Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "vmrwyzzsl8fal6zy7xg4nv1a": {
    "categoryId": "vmrwyzzsl8fal6zy7xg4nv1a",
    "categorySlug": "nakonechnyky-midno-alyuminiyevi-seriyi-dtl",
    "categoryNameUk": "Наконечники мідно-алюмінієві серії DTL",
    "categoryNameRu": "Наконечники медно-алюминиевые серии DTL",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.029Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "hofgfrxke2cygaq3clat88ck": {
    "categoryId": "hofgfrxke2cygaq3clat88ck",
    "categorySlug": "nakonechnyky-midni-z-ohlyadovym-otvorom-seriyi-sc",
    "categoryNameUk": "Наконечники мідні з оглядовим отвором серії SC",
    "categoryNameRu": "Наконечники медные с смотровым отверстием серии SC",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.110Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "kxx997k3ple7u7a0ox2un55m": {
    "categoryId": "kxx997k3ple7u7a0ox2un55m",
    "categorySlug": "nakonechnyky-ploska-holka-seriyi-dbv",
    "categoryNameUk": "Наконечники «плоска голка» серії DBV",
    "categoryNameRu": "Наконечники «плоская игла» серии DBV",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.189Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "alh8pkl0zwkrn1zjfirtnikb": {
    "categoryId": "alh8pkl0zwkrn1zjfirtnikb",
    "categorySlug": "nakonechnyky-trubchasti-seriyi-nt",
    "categoryNameUk": "Наконечники трубчасті серії НТ",
    "categoryNameRu": "Наконечники трубчатые серии НТ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.267Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ra151pxrrsakflppzctfshsq": {
    "categoryId": "ra151pxrrsakflppzctfshsq",
    "categorySlug": "nakonechnyky-trubchasti-dlya-dvokh-provodiv-seriyi-te",
    "categoryNameUk": "Наконечники трубчасті для двох проводів серії ТЕ",
    "categoryNameRu": "Наконечники трубчатые для двух проводов серии ТЕ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.342Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "d2n8v7npf42v4i0ygylhi8u7": {
    "categoryId": "d2n8v7npf42v4i0ygylhi8u7",
    "categorySlug": "nakonechnyky-vylochni-seriyi-sv",
    "categoryNameUk": "Наконечники вилочні серії SV",
    "categoryNameRu": "Наконечники вилочные серии SV",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.420Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "thw03u3yyxtcrojyf4qfcxqp": {
    "categoryId": "thw03u3yyxtcrojyf4qfcxqp",
    "categorySlug": "hilzy-z-yednannya-yednuvalni-midni-seriyi-vv",
    "categoryNameUk": "Гільзи з'єднання єднувальні мідні серії ВV",
    "categoryNameRu": "Гильзы соединительные медные серии ВV",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.494Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "g6v2dg21zl955ao4lmqhg66k": {
    "categoryId": "g6v2dg21zl955ao4lmqhg66k",
    "categorySlug": "konektory-ploski-seriy-fdd-mdd",
    "categoryNameUk": "Конектори плоскі серій FDD, MDD",
    "categoryNameRu": "Коннекторы плоские серии FDD, MDD",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.573Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "rdzllycrr29bmbjj8w6z68jv": {
    "categoryId": "rdzllycrr29bmbjj8w6z68jv",
    "categorySlug": "konektory-ploski-seriyi-fdfd",
    "categoryNameUk": "Конектори плоскі серії FDFD",
    "categoryNameRu": "Коннекторы плоские серии FDFD",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.645Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "f2po00wenrszsp9npkiemjwk": {
    "categoryId": "f2po00wenrszsp9npkiemjwk",
    "categorySlug": "konektory-ploski-seriy-fdfny-mdfny",
    "categoryNameUk": "Конектори плоскі серій FDFNY, MDFNY",
    "categoryNameRu": "Коннекторы плоские серии FDFNY, MDFNY",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.716Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "po93om3ai47m2t1vau3vo2id": {
    "categoryId": "po93om3ai47m2t1vau3vo2id",
    "categorySlug": "konektory-tsylindrychni-seriy-frd-mpd",
    "categoryNameUk": "Конектори циліндричні серій FRD, MPD",
    "categoryNameRu": "Коннекторы цилиндрические серий FRD, MPD",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.786Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "r93p8u2iaodr7o8vws8aye5u": {
    "categoryId": "r93p8u2iaodr7o8vws8aye5u",
    "categorySlug": "nakonechnyky-vylochni-seriyi-snb",
    "categoryNameUk": "Наконечники вилочні серії SNB",
    "categoryNameRu": "Наконечники вилочные серии SNB",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.858Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "w6ave1csb2k8nc4y6nbhcvpq": {
    "categoryId": "w6ave1csb2k8nc4y6nbhcvpq",
    "categorySlug": "hilzy-z-yednannya-yednuvalni-alyuminiyevi-seriyi-gl",
    "categoryNameUk": "Гільзи з'єднання єднувальні алюмінієві серії GL",
    "categoryNameRu": "Гильзы соединительные алюминиевые серии GL",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:30.938Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "g4m7hum9jn77j0tie8khpyn8": {
    "categoryId": "g4m7hum9jn77j0tie8khpyn8",
    "categorySlug": "hilzy-z-yednannya-yednuvalni-midni-seriyi-en",
    "categoryNameUk": "Гільзи з'єднання єднувальні мідні серії EN",
    "categoryNameRu": "Гильзы соединительные медные серии EN",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.013Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "sml3p8lq0lfzobo3lowwkcpp": {
    "categoryId": "sml3p8lq0lfzobo3lowwkcpp",
    "categorySlug": "hilzy-z-yednannya-yednuvalni-midni-seriyi-gt",
    "categoryNameUk": "Гільзи з'єднання єднувальні мідні серії GT",
    "categoryNameRu": "Гильзы соединительные медные серии GT",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.088Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "l4plkp289b8gyq6bkogtiuag": {
    "categoryId": "l4plkp289b8gyq6bkogtiuag",
    "categorySlug": "hilzy-z-yednannya-yednuvalni-midno-alyuminiyevi-seriyi-gtl",
    "categoryNameUk": "Гільзи з'єднання єднувальні мідно-алюмінієві серії GTL",
    "categoryNameRu": "Гильзы соединительные медно-алюминиевые серии GTL",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.158Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "xfw8ymgrgxqifqhlm0zlcnyu": {
    "categoryId": "xfw8ymgrgxqifqhlm0zlcnyu",
    "categorySlug": "shyny-nulovi-bruskom",
    "categoryNameUk": "Шини нульові бруском",
    "categoryNameRu": "Шины нулевые бруском",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.229Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "x5rvoaj3xkc276m3u92sgcex": {
    "categoryId": "x5rvoaj3xkc276m3u92sgcex",
    "categorySlug": "shyny-nulovi-bruskom-z-izolyatoramy-seriy-vs-1a-i-vs-2a",
    "categoryNameUk": "Шини нульові бруском з ізоляторами серій ВС-1А і ВС-2А",
    "categoryNameRu": "Шины нулевые бруском с изоляторами серий ВС-1А и ВС-2А",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.304Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "uff6aizqqlzlamkmul9n8m7d": {
    "categoryId": "uff6aizqqlzlamkmul9n8m7d",
    "categorySlug": "shyny-nulovi-z-izolyatorom-na-din-reyku-seriy-vs-4a-i-vs-5khkh",
    "categoryNameUk": "Шини нульові з ізолятором на DIN-рейку серій ВС-4А і ВС-5хх",
    "categoryNameRu": "Шины нулевые с изолятором на DIN-рейку серий ВС-4А и ВС-5хх",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.376Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "qo71itd94jgdgh5gx7jdsr3t": {
    "categoryId": "qo71itd94jgdgh5gx7jdsr3t",
    "categorySlug": "shyny-nulovi-universalni-seriy-vs-3a",
    "categoryNameUk": "Шини нульові універсальні серій ВС-3А",
    "categoryNameRu": "Шины нулевые универсальные серии ВС-3А",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.450Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "kmyygxrhufxn1tamczme0qvf": {
    "categoryId": "kmyygxrhufxn1tamczme0qvf",
    "categorySlug": "shyna-nulova-z-kryshkoyu-vs-10",
    "categoryNameUk": "Шина нульова з кришкою ВС-10",
    "categoryNameRu": "Шина нулевая с крышкой ВС-10",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.520Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "n7okw9ct60xofm176x9kk8pz": {
    "categoryId": "n7okw9ct60xofm176x9kk8pz",
    "categorySlug": "shyny-nulovi-u-korpusi",
    "categoryNameUk": "Шини нульові у корпусі",
    "categoryNameRu": "Шины нулевые в корпусе",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.592Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "o7cqjvq1f2gevf9d0ip7di2a": {
    "categoryId": "o7cqjvq1f2gevf9d0ip7di2a",
    "categorySlug": "planka-z-yednannya-yednuvalna-jxb-gk3",
    "categoryNameUk": "Планка з'єднання єднувальна JXB-GK3",
    "categoryNameRu": "Планка соединительная JXB-GK3",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.731Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "se0s9ldxpby9xc4933sk633i": {
    "categoryId": "se0s9ldxpby9xc4933sk633i",
    "categorySlug": "bokova-plastyna-zahlushka",
    "categoryNameUk": "Бокова Пластина (заглушка)",
    "categoryNameRu": "Пластина боковая (заглушка)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.807Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "a3l9583ztcy5ckq6zme8zm4m": {
    "categoryId": "a3l9583ztcy5ckq6zme8zm4m",
    "categorySlug": "skobi-kabelni",
    "categoryNameUk": "Скобі кабельні",
    "categoryNameRu": "Скобы кабельные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:31.956Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "ht9doxunfzdni2n1pskj9rsm": {
    "categoryId": "ht9doxunfzdni2n1pskj9rsm",
    "categorySlug": "skobi-kabelni-z-tsvyakhom-kruhli",
    "categoryNameUk": "Скобі кабельні з цвяхом круглі",
    "categoryNameRu": "Скобы кабельные с гвоздем круглые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:32.045Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "v8nwi5qbml2wjse9h99do1d6": {
    "categoryId": "v8nwi5qbml2wjse9h99do1d6",
    "categorySlug": "skobi-kabelni-z-tsvyakhom-ploski",
    "categoryNameUk": "Скобі кабельні з цвяхом плоскі",
    "categoryNameRu": "Кабельные скобы с гвоздем плоские",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:32.126Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "e1gnco13oo5q0q08mgiep6sx": {
    "categoryId": "e1gnco13oo5q0q08mgiep6sx",
    "categorySlug": "khomuty-prosti",
    "categoryNameUk": "Хомути прості",
    "categoryNameRu": "Хомуты простые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:32.202Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "jaxeklkm2wlu1k9dshsho5li": {
    "categoryId": "jaxeklkm2wlu1k9dshsho5li",
    "categorySlug": "khomuty-vuzlykovi-bahatorazovi",
    "categoryNameUk": "Хомути вузликові багаторазові",
    "categoryNameRu": "Хомуты узловые многоразовые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:32.341Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "w0r3nih1kdwju36q4j3elrtb": {
    "categoryId": "w0r3nih1kdwju36q4j3elrtb",
    "categorySlug": "khomuty-markuvalni",
    "categoryNameUk": "Хомути маркувальні",
    "categoryNameRu": "Хомуты маркировочные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:32.412Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "pqqah9flfek4lhscxzivga6t": {
    "categoryId": "pqqah9flfek4lhscxzivga6t",
    "categorySlug": "khomuty-shvydkoho-montazhu-z-dyubelem",
    "categoryNameUk": "Хомути швидкого монтажу з дюбелем",
    "categoryNameRu": "Хомуты быстрого монтажа с дюбелем",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:32.485Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "bq19bql5t1sbfl3h7rti6sfx": {
    "categoryId": "bq19bql5t1sbfl3h7rti6sfx",
    "categorySlug": "maydanchyky-dlya-khomutiv",
    "categoryNameUk": "Майданчики для хомутів",
    "categoryNameRu": "Площадки для хомутов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:32.557Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "sj30b1x9f41xugybel20xh8a": {
    "categoryId": "sj30b1x9f41xugybel20xh8a",
    "categorySlug": "khomuty-ukrayinskoho-vyrobnytstva",
    "categoryNameUk": "Хомути українського виробництва",
    "categoryNameRu": "Хомуты украинского производства",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:32.637Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "gsf4xa9l7cg5j5k5z7295ihf": {
    "categoryId": "gsf4xa9l7cg5j5k5z7295ihf",
    "categorySlug": "hazovi-reduktory",
    "categoryNameUk": "Газові редуктори",
    "categoryNameRu": "Газовые редукторы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.038Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "cz2kheddkfcvzuk7q4ygbttk": {
    "categoryId": "cz2kheddkfcvzuk7q4ygbttk",
    "categorySlug": "dlya-hipsokartonu",
    "categoryNameUk": "Для гіпсокартону",
    "categoryNameRu": "Для гипсокартона",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.177Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "pos1kvfxqxsu758o6l61b9dg": {
    "categoryId": "pos1kvfxqxsu758o6l61b9dg",
    "categorySlug": "z-matrytseyu-revolvernoho-typu",
    "categoryNameUk": "З матрицею револьверного типу",
    "categoryNameRu": "С матрицей револьверного типа",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.263Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "rsun69di5a9qh024nifs5pyn": {
    "categoryId": "rsun69di5a9qh024nifs5pyn",
    "categorySlug": "z-khrapovym-mekhanizmom",
    "categoryNameUk": "З храповим механізмом",
    "categoryNameRu": "С храповым механизмом",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.342Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "au7ql2qe2h9lkppe5f72lbtq": {
    "categoryId": "au7ql2qe2h9lkppe5f72lbtq",
    "categorySlug": "hidravlichni-nozhytsi",
    "categoryNameUk": "Гідравлічні ножиці",
    "categoryNameRu": "Гидравлические ножницы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.413Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "j1x402eoae5qe54hlhgynopm": {
    "categoryId": "j1x402eoae5qe54hlhgynopm",
    "categorySlug": "nabory-instrumentiv-1",
    "categoryNameUk": "Набори інструментів",
    "categoryNameRu": "Наборы инструментов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.494Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "n7z34v2k46kpdwsmuwnjuauc": {
    "categoryId": "n7z34v2k46kpdwsmuwnjuauc",
    "categorySlug": "dryli-udarni",
    "categoryNameUk": "Дрилі ударні",
    "categoryNameRu": "Дрели ударные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.578Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "pukjj2xu58m1qmswzl0q3sqi": {
    "categoryId": "pukjj2xu58m1qmswzl0q3sqi",
    "categorySlug": "prystosuvannya-dlya-dryliv",
    "categoryNameUk": "Пристосування для дрилів",
    "categoryNameRu": "Приспособления для дрелей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.653Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "mv5q2wue87qc4hpsakd3zxvv": {
    "categoryId": "mv5q2wue87qc4hpsakd3zxvv",
    "categorySlug": "mashyny-shlifuvalni",
    "categoryNameUk": "Машини шліфувальні",
    "categoryNameRu": "Машины шлифовальные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.737Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "tv96ibpy8vwqtwpu9o5d56a5": {
    "categoryId": "tv96ibpy8vwqtwpu9o5d56a5",
    "categorySlug": "perforatory",
    "categoryNameUk": "Перфоратори",
    "categoryNameRu": "Перфораторы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.815Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "wtztnmnczxvownvc5ayagmya": {
    "categoryId": "wtztnmnczxvownvc5ayagmya",
    "categorySlug": "bolharky",
    "categoryNameUk": "Болгарки",
    "categoryNameRu": "Болгарки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.902Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "g0wwsgr10cwqbf39eczsx16s": {
    "categoryId": "g0wwsgr10cwqbf39eczsx16s",
    "categorySlug": "rukoyatky-z-khrapovym-mekhanizmom-triskachky",
    "categoryNameUk": "Рукоятки з храповим механізмом (тріскачки)",
    "categoryNameRu": "Рукоятки с храповым механизмом (трещотки)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:33.977Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "q2f235fy640pkez6n6fw882q": {
    "categoryId": "q2f235fy640pkez6n6fw882q",
    "categorySlug": "perekhidnyky-ta-kardany",
    "categoryNameUk": "Перехідники та кардани",
    "categoryNameRu": "Переходники и карданы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:34.057Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "nt9m6rm35hqo59w3i4wlmr3h": {
    "categoryId": "nt9m6rm35hqo59w3i4wlmr3h",
    "categorySlug": "podovzhuvachi",
    "categoryNameUk": "Подовжувачі",
    "categoryNameRu": "Удлинители",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:34.134Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "xazm8uksgcmul3gshaiwl7jb": {
    "categoryId": "xazm8uksgcmul3gshaiwl7jb",
    "categorySlug": "znimachi-pidshypnykiv",
    "categoryNameUk": "Знімачі підшипників",
    "categoryNameRu": "Съемники подшипников",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:34.367Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "uwg84don5r81l3dgsssu3f70": {
    "categoryId": "uwg84don5r81l3dgsssu3f70",
    "categorySlug": "shchyptsi-dlya-stopornykh-kilets",
    "categoryNameUk": "Щипці для стопорних кілець",
    "categoryNameRu": "Щипцы для стопорных колец",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:34.465Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "njgfgi6x5i76upjk8iwvq0ih": {
    "categoryId": "njgfgi6x5i76upjk8iwvq0ih",
    "categorySlug": "modulni-avtomatychni-vymykachi-utrust",
    "categoryNameUk": "Модульні автоматичні вимикачі UTrust",
    "categoryNameRu": "Модульные автоматические выключатели UTrust",
    "params": {
      "distBlock": 1,
      "floorShadowY": 0.9,
      "minHoleSize": 99999,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:34.547Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "fpndq9pwk31x8wcr07axlu1l": {
    "categoryId": "fpndq9pwk31x8wcr07axlu1l",
    "categorySlug": "modulni-avtomatychni-vymykachi-uprofi",
    "categoryNameUk": "Модульні автоматичні вимикачі UProfi",
    "categoryNameRu": "Модульные автоматические выключатели UProfi",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:34.629Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "cpctjn1h3w6mt0pk3q5l642i": {
    "categoryId": "cpctjn1h3w6mt0pk3q5l642i",
    "categorySlug": "dodatkove-obladnannya-utrust",
    "categoryNameUk": "Додаткове обладнання UTrust",
    "categoryNameRu": "Дополнительное оборудование UTrust",
    "params": {
      "distBlock": 1,
      "floorShadowY": 0.9,
      "minHoleSize": 99999,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:34.702Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "wmcff0m6hemv9jow05n0l32j": {
    "categoryId": "wmcff0m6hemv9jow05n0l32j",
    "categorySlug": "prystroyi-zakhysnoho-vidklyuchennya-utrust",
    "categoryNameUk": "Пристрої захисного відключення UTrust",
    "categoryNameRu": "Устройства защитного отключения (УЗО) UTrust",
    "params": {
      "distBlock": 1,
      "floorShadowY": 0.9,
      "minHoleSize": 99999,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:34.781Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "zp23w6cfw27dgmp0f8x4ywkg": {
    "categoryId": "zp23w6cfw27dgmp0f8x4ywkg",
    "categorySlug": "prystroyi-zakhysnoho-vidklyuchennya-z-zakhystom-vid-nadstrumiv-utrust",
    "categoryNameUk": "Пристрої захисного відключення з захистом від надструмів UTrust",
    "categoryNameRu": "Устройства защитного отключения с защитой от сверхтоков UTrust",
    "params": {
      "distBlock": 1,
      "floorShadowY": 0.9,
      "minHoleSize": 99999,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:34.858Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "o45rx2litiairgw2pzvtsmih": {
    "categoryId": "o45rx2litiairgw2pzvtsmih",
    "categorySlug": "elektrody-dlya-zvaryuvannya-konstruktsiy-z-nyzkovuhletsevykh-staley",
    "categoryNameUk": "Електроди для зварювання конструкцій з низьковуглецевих сталей",
    "categoryNameRu": "Электроды для сварки конструкций из низкоуглеродистых сталей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:35.158Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "l7x2x97e2g2mb4b5b8eucfsx": {
    "categoryId": "l7x2x97e2g2mb4b5b8eucfsx",
    "categorySlug": "elektrody-dlya-zvaryuvannya-konstruktsiy-z-vuhletsevykh-ta-nyzkolehovanykh-staley",
    "categoryNameUk": "Електроди для зварювання конструкцій з вуглецевих та низьколегованих сталей",
    "categoryNameRu": "Электроды для сварки конструкций из углеродистых и низколегированных сталей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:35.234Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "r16k1qzo2ztvt1g1tzo0wjgf": {
    "categoryId": "r16k1qzo2ztvt1g1tzo0wjgf",
    "categorySlug": "elektrody-dlya-naplavlennya",
    "categoryNameUk": "Електроди для наплавлення",
    "categoryNameRu": "Электроды для наплавки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:35.376Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "gio8qopdw5l33ycny49t6g3i": {
    "categoryId": "gio8qopdw5l33ycny49t6g3i",
    "categorySlug": "elektrody-dlya-zvaryuvannya-chavunu",
    "categoryNameUk": "Електроди для зварювання чавуну",
    "categoryNameRu": "Электроды для сварки чугуна",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:35.449Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "ik8uli0hl0vbbj53qmn1wkld": {
    "categoryId": "ik8uli0hl0vbbj53qmn1wkld",
    "categorySlug": "zvaryuvalnyy-obmidnenyy-drit-paton",
    "categoryNameUk": "Зварювальний обміднений дріт PATON™",
    "categoryNameRu": "Омедненная проволока PATON™",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:35.606Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "j4ndomfky6z884d6qcju3kw7": {
    "categoryId": "j4ndomfky6z884d6qcju3kw7",
    "categorySlug": "antypryharni-zasoby-ta-okholodzhuyuchi-ahenty",
    "categoryNameUk": "Антипригарні засоби та охолоджуючі агенти",
    "categoryNameRu": "Антипригарные средства и охлаждающие жидкости",
    "params": {
      "distBlock": 0,
      "floorShadowY": 0.85,
      "minHoleSize": 99999
    },
    "calibratedAt": "2026-06-02T19:01:35.756Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "ukoyvb0ra15jnwvlgt0l2ykt": {
    "categoryId": "ukoyvb0ra15jnwvlgt0l2ykt",
    "categorySlug": "volframovi-elektrody",
    "categoryNameUk": "Вольфрамові електроди",
    "categoryNameRu": "Вольфрамовые электроды Gradient",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:35.907Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "npqcys7kamjbpw987abwpkpe": {
    "categoryId": "npqcys7kamjbpw987abwpkpe",
    "categorySlug": "alyuminiyevyy-zvaryuvalnyy-drit-mig",
    "categoryNameUk": "Алюмінієвий зварювальний дріт MIG",
    "categoryNameRu": "Алюминиевая сварочная проволока MIG",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:35.984Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "krr1arxhtuocjqap5szheplo": {
    "categoryId": "krr1arxhtuocjqap5szheplo",
    "categorySlug": "prutky-prysadochni",
    "categoryNameUk": "Прутки присадочні",
    "categoryNameRu": "Присадочные прутки и вольфрамовые электроды для сварки TIG",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:36.055Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "ng4gdx1jh6fjya5t82ji9fm3": {
    "categoryId": "ng4gdx1jh6fjya5t82ji9fm3",
    "categorySlug": "kabeli-droty",
    "categoryNameUk": "Кабелі дроти",
    "categoryNameRu": "Кабели провода",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:36.285Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "fqo2e6o8rzstrqqkorxea101": {
    "categoryId": "fqo2e6o8rzstrqqkorxea101",
    "categorySlug": "palnyky-mig-mag",
    "categoryNameUk": "Пальники MIG/MAG",
    "categoryNameRu": "Горелки MIG/MAG",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:36.568Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "y21qhp4pzjf4f1qv72d889lw": {
    "categoryId": "y21qhp4pzjf4f1qv72d889lw",
    "categorySlug": "plazmatrony",
    "categoryNameUk": "Плазматрони",
    "categoryNameRu": "Плазматроны",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:36.640Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "uku44kf0zrkfrz80ognohh9v": {
    "categoryId": "uku44kf0zrkfrz80ognohh9v",
    "categorySlug": "arhonoduhovi-aparaty-tig",
    "categoryNameUk": "Аргонодугові апарати TIG",
    "categoryNameRu": "Аргонодуговые аппараты TIG",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:36.712Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "asjjowjj9vo4hm8658jrnmu2": {
    "categoryId": "asjjowjj9vo4hm8658jrnmu2",
    "categorySlug": "pidihrivachi-hazu",
    "categoryNameUk": "Підігрівачі газу",
    "categoryNameRu": "Подогреватели газа",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:36.790Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "qkfk3jzkc0bmxf759vsx66mj": {
    "categoryId": "qkfk3jzkc0bmxf759vsx66mj",
    "categorySlug": "shtekera-i-hnizda-dlya-zvaryuvalnoho-ustatkuvannya",
    "categoryNameUk": "Штекера і гнізда для зварювального устаткування",
    "categoryNameRu": "Штекера и гнезда для сварочного оборудования",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:36.861Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "wm86lbu75wzcfceuhc20babk": {
    "categoryId": "wm86lbu75wzcfceuhc20babk",
    "categorySlug": "komplekty-zvaryuvalnykh-kabeliv",
    "categoryNameUk": "Комплекти зварювальних кабелів",
    "categoryNameRu": "Комплекты сварочных кабелей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:36.943Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "wkvm3lqkwb1gmvrqqsuyf6lu": {
    "categoryId": "wkvm3lqkwb1gmvrqqsuyf6lu",
    "categorySlug": "vizky",
    "categoryNameUk": "Візки",
    "categoryNameRu": "Тележки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:37.100Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "ng0rjg0oq6cjkf99r77mypxq": {
    "categoryId": "ng0rjg0oq6cjkf99r77mypxq",
    "categorySlug": "bloky-podachi-drotu",
    "categoryNameUk": "Блоки подачі дроту",
    "categoryNameRu": "Блоки подачи проволоки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:37.318Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "fz6nfu1qidjhcy5woa6ibhvf": {
    "categoryId": "fz6nfu1qidjhcy5woa6ibhvf",
    "categorySlug": "plazmorizy",
    "categoryNameUk": "Плазморізи",
    "categoryNameRu": "Плазморезы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:37.388Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "fto47yp0w2547wiysb63ug3s": {
    "categoryId": "fto47yp0w2547wiysb63ug3s",
    "categorySlug": "bloky-avtonomnoho-okholodzhennya",
    "categoryNameUk": "Блоки автономного охолодження",
    "categoryNameRu": "Блоки автономного охлаждения",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:37.458Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "a84dkgoz7lvgmh7gvsfquhkh": {
    "categoryId": "a84dkgoz7lvgmh7gvsfquhkh",
    "categorySlug": "obladnannya-dlya-mikrozvaryuvannya",
    "categoryNameUk": "Обладнання для мікрозварювання",
    "categoryNameRu": "Оборудование для микросварки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:37.529Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "nqhgd5yj7qb71mrr8w88l902": {
    "categoryId": "nqhgd5yj7qb71mrr8w88l902",
    "categorySlug": "obmidnenyy-zvaryuvalnyy-drit-mig",
    "categoryNameUk": "Обміднений зварювальний дріт MIG",
    "categoryNameRu": "Омедненная сварочная проволока MIG",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:37.605Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "clojhzvwg5w1d41kql866p8q": {
    "categoryId": "clojhzvwg5w1d41kql866p8q",
    "categorySlug": "flyusovi-zvaryuvalni-droty-mig",
    "categoryNameUk": "Флюсові зварювальні дроти MIG",
    "categoryNameRu": "Флюсовые сварочные проволоки MIG",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:37.746Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "kzdv7aaregg21iu95vii9aez": {
    "categoryId": "kzdv7aaregg21iu95vii9aez",
    "categorySlug": "korob-plastykovyy-seriyi-step",
    "categoryNameUk": "Короб пластиковий серії STEP",
    "categoryNameRu": "Короб пластиковый серии STEP",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:37.820Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "x959xzhm0rmds865uhzrg9pt": {
    "categoryId": "x959xzhm0rmds865uhzrg9pt",
    "categorySlug": "elektroinstrument-i-obladnannya",
    "categoryNameUk": "Електроінструмент і обладнання",
    "categoryNameRu": "Электроинструмент и оборудование",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:38.036Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "tmyd35ecjvvilezswo9grkk0": {
    "categoryId": "tmyd35ecjvvilezswo9grkk0",
    "categorySlug": "kompresory",
    "categoryNameUk": "Компресори",
    "categoryNameRu": "Компрессоры",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:38.119Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "dkpeeom8i6q7vjs2yt8t1996": {
    "categoryId": "dkpeeom8i6q7vjs2yt8t1996",
    "categorySlug": "stolyarno-slyusarnyy-instrument",
    "categoryNameUk": "Столярно-слюсарний інструмент",
    "categoryNameRu": "Столярно-слесарный инструмент",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:38.266Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "fw2yyxx9rtf20twt5hz58tzs": {
    "categoryId": "fw2yyxx9rtf20twt5hz58tzs",
    "categorySlug": "kripylnyy-instrument",
    "categoryNameUk": "Кріпильний інструмент",
    "categoryNameRu": "Крепежный инструмент",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:38.409Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "j7hh6x4q06ipad5xaj1hzitu": {
    "categoryId": "j7hh6x4q06ipad5xaj1hzitu",
    "categorySlug": "zakhysnyy-odyah",
    "categoryNameUk": "Захисний одяг",
    "categoryNameRu": "Защитная одежда",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:38.779Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "f8rxsg1gqih1c029rtjx62i5": {
    "categoryId": "f8rxsg1gqih1c029rtjx62i5",
    "categorySlug": "instrument-bahatofunktsionalnyy-renovator",
    "categoryNameUk": "Інструмент багатофункціональний ( РЕНОВАТОР )",
    "categoryNameRu": "Инструмент многофункциональный (РЕНОВАТОР)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:38.850Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "fbgv5a5r2s2ggks9x8dvh2eh": {
    "categoryId": "fbgv5a5r2s2ggks9x8dvh2eh",
    "categorySlug": "shlifmashyny-strichkovi",
    "categoryNameUk": "Шліфмашини стрічкові",
    "categoryNameRu": "Шлифмашины ленточные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:38.925Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "tsphzhity0whbzipikwokc2c": {
    "categoryId": "tsphzhity0whbzipikwokc2c",
    "categorySlug": "shlifmashyny-pryami",
    "categoryNameUk": "Шліфмашини прямі",
    "categoryNameRu": "Шлифмашины прямые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:39.001Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "zyb3pbrx5213x3tna92x8y8w": {
    "categoryId": "zyb3pbrx5213x3tna92x8y8w",
    "categorySlug": "shlifmashyny-ekstsentrykovi",
    "categoryNameUk": "Шліфмашини ексцентрикові",
    "categoryNameRu": "Шлифмашины эксцентриковые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:39.149Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "m7pvd0pp3ovuxeiljyw9mn5t": {
    "categoryId": "m7pvd0pp3ovuxeiljyw9mn5t",
    "categorySlug": "kompresory-avtomobilni",
    "categoryNameUk": "Компресори автомобільні",
    "categoryNameRu": "Компрессоры автомобильные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:39.228Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "wi4apyulxt4prcezl816l77u": {
    "categoryId": "wi4apyulxt4prcezl816l77u",
    "categorySlug": "instrument-slyusarnyy",
    "categoryNameUk": "Інструмент слюсарний",
    "categoryNameRu": "Инструмент слесарный",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:39.372Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "n9p8b9p992li6o3ut67n4g3j": {
    "categoryId": "n9p8b9p992li6o3ut67n4g3j",
    "categorySlug": "domkraty-hidravlichni-stovpchyk",
    "categoryNameUk": "Домкрати гідравлічні \"стовпчик \"",
    "categoryNameRu": "Домкрати",
    "params": {
      "distBlock": 4,
      "floorShadowY": 0.82,
      "minHoleSize": 800
    },
    "calibratedAt": "2026-06-02T19:01:39.524Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "pnbpqxjyfhx1c0vfanc9255p": {
    "categoryId": "pnbpqxjyfhx1c0vfanc9255p",
    "categorySlug": "ustatkuvannya-hidravlichne-dlya-sto",
    "categoryNameUk": "Устаткування гідравлічне для СТО",
    "categoryNameRu": "Гидравлическое оборудование для СТО",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:39.604Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "u0v1n4erremvsex0jztpmj8o": {
    "categoryId": "u0v1n4erremvsex0jztpmj8o",
    "categorySlug": "elektropyly",
    "categoryNameUk": "Електропили",
    "categoryNameRu": "Электропилы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:39.890Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "cnimsqflmr7fqmavvus9wjij": {
    "categoryId": "cnimsqflmr7fqmavvus9wjij",
    "categorySlug": "verstaty-tochylni",
    "categoryNameUk": "Верстати точильні",
    "categoryNameRu": "Станки точильные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:39.970Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "jcmpl5p7407980js9rcg9pts": {
    "categoryId": "jcmpl5p7407980js9rcg9pts",
    "categorySlug": "frezery-ta-frezy",
    "categoryNameUk": "Фрезери та фрези",
    "categoryNameRu": "Фрезеры и фрезы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:40.048Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "l30h8u3o4qthycuy0zt8iufd": {
    "categoryId": "l30h8u3o4qthycuy0zt8iufd",
    "categorySlug": "elektrolobzyky",
    "categoryNameUk": "Електролобзики",
    "categoryNameRu": "Электролобзики",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:40.123Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "g12t9skx8esf9iv833hknby6": {
    "categoryId": "g12t9skx8esf9iv833hknby6",
    "categorySlug": "elektrorubanky",
    "categoryNameUk": "Електрорубанки",
    "categoryNameRu": "Электрорубанки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:40.199Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "idd2i9xw3c61idxr873njqpd": {
    "categoryId": "idd2i9xw3c61idxr873njqpd",
    "categorySlug": "pylososy-promyslovi",
    "categoryNameUk": "Пилососи промислові",
    "categoryNameRu": "Пылесосы промышленные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:40.275Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "x5jix074yxrw7is5ydyaozho": {
    "categoryId": "x5jix074yxrw7is5ydyaozho",
    "categorySlug": "feny-tekhnichni-dlya-vypalu",
    "categoryNameUk": "Фени технічні для випалу",
    "categoryNameRu": "Фены технические для обжига",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:40.417Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "kywjjdgk6huphql3qp7mc3zw": {
    "categoryId": "kywjjdgk6huphql3qp7mc3zw",
    "categorySlug": "vykrutky-akumulyatorni",
    "categoryNameUk": "Викрутки акумуляторні",
    "categoryNameRu": "Отвертки аккумуляторные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:40.488Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "p3saohxog345s1u8vsz81ok0": {
    "categoryId": "p3saohxog345s1u8vsz81ok0",
    "categorySlug": "mashyny-poliruvalni",
    "categoryNameUk": "Машини полірувальні",
    "categoryNameRu": "Машины полировальные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:40.557Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "h5p9timdon0jitkgari153l3": {
    "categoryId": "h5p9timdon0jitkgari153l3",
    "categorySlug": "masky-zvaryuvalni",
    "categoryNameUk": "Маски зварювальні",
    "categoryNameRu": "Маски зварювальні",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:40.702Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "qcpiirumevaqhkxvb1gi097o": {
    "categoryId": "qcpiirumevaqhkxvb1gi097o",
    "categorySlug": "haykoverty-pnevmatychni",
    "categoryNameUk": "Гайковерти пневматичні",
    "categoryNameRu": "Гайковерты пневматические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:40.773Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "j3xnrvad8c8rhn7dt7mtrn4e": {
    "categoryId": "j3xnrvad8c8rhn7dt7mtrn4e",
    "categorySlug": "pnevmosteplery-ta-detali",
    "categoryNameUk": "Пневмостеплери та деталі",
    "categoryNameRu": "Пневмостеплеры и детали",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:40.849Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "pesjfq2mq6xj5vbldg8kmxwx": {
    "categoryId": "pesjfq2mq6xj5vbldg8kmxwx",
    "categorySlug": "pistolety-dlya-rozpylennya",
    "categoryNameUk": "Пістолети для розпилення",
    "categoryNameRu": "Пистолеты для распыления",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:40.927Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "yk2grkpcvhevhyu3x9febe9x": {
    "categoryId": "yk2grkpcvhevhyu3x9febe9x",
    "categorySlug": "shlifmashyny-pnevmatychni",
    "categoryNameUk": "Шліфмашини пневматичні",
    "categoryNameRu": "Шлифмашины пневматические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:41.002Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "bzrkl4cixek1ak1xtp5q7qot": {
    "categoryId": "bzrkl4cixek1ak1xtp5q7qot",
    "categorySlug": "zubyla-pnevmatychni",
    "categoryNameUk": "Зубила пневматичні",
    "categoryNameRu": "Зубила пневматические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:41.075Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "fi4c77oo8bn046g7i6zvnuoq": {
    "categoryId": "fi4c77oo8bn046g7i6zvnuoq",
    "categorySlug": "nabory-pnevmatychnoho-instrumentu",
    "categoryNameUk": "Набори пневматичного інструменту",
    "categoryNameRu": "Наборы пневматического инструмента",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:41.225Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "icsznbhe63kf8vkwsu8lp06h": {
    "categoryId": "icsznbhe63kf8vkwsu8lp06h",
    "categorySlug": "shurupokruty-pnevmatychni",
    "categoryNameUk": "Шурупокрути пневматичні",
    "categoryNameRu": "Шуруповерты пневматические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:41.301Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "jagg90g5rhc7vvq2e7mmc2wb": {
    "categoryId": "jagg90g5rhc7vvq2e7mmc2wb",
    "categorySlug": "fitynhy-dlya-pnevmosystem",
    "categoryNameUk": "Фітинги для пневмосистем",
    "categoryNameRu": "Фитинги для пневмосистем",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:41.381Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ghjmji7x9i2qyz0qxqfurwco": {
    "categoryId": "ghjmji7x9i2qyz0qxqfurwco",
    "categorySlug": "komplektuyuchi-dlya-kompresoriv",
    "categoryNameUk": "Комплектуючі для компресорів",
    "categoryNameRu": "Комплектующие для компрессоров",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:41.462Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "is2nfv6tny4nfn41ockch498": {
    "categoryId": "is2nfv6tny4nfn41ockch498",
    "categorySlug": "kontrolno-rozpodilni-bloky",
    "categoryNameUk": "Контрольно- розподільні блоки",
    "categoryNameRu": "Контрольно-распределительные блоки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:41.535Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "w0q6dao0bdlycvn78we8up0h": {
    "categoryId": "w0q6dao0bdlycvn78we8up0h",
    "categorySlug": "shtanhentsyrkuli",
    "categoryNameUk": "Штангенциркулі",
    "categoryNameRu": "Штангенциркули",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:41.612Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "fn31au0q48m3qf71y098tmiv": {
    "categoryId": "fn31au0q48m3qf71y098tmiv",
    "categorySlug": "mikrometry",
    "categoryNameUk": "Мікрометри",
    "categoryNameRu": "Микрометры",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:41.687Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "gj5708cyciwbo3gyhkt3wq9r": {
    "categoryId": "gj5708cyciwbo3gyhkt3wq9r",
    "categorySlug": "multymetry",
    "categoryNameUk": "Мультиметри",
    "categoryNameRu": "Мультиметры",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:41.760Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "jwkoopgpk1m698gcty8k34x7": {
    "categoryId": "jwkoopgpk1m698gcty8k34x7",
    "categorySlug": "nozhi-y-skalpeli",
    "categoryNameUk": "Ножі й скальпелі",
    "categoryNameRu": "Ножи и скальпели",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:41.980Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "tpsrlzg330wpbavc11ggmsc1": {
    "categoryId": "tpsrlzg330wpbavc11ggmsc1",
    "categorySlug": "pistolety-dlya-piny",
    "categoryNameUk": "Пістолети для піни",
    "categoryNameRu": "Пистолеты для пены",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:42.055Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "c97988am534vak585p660epy": {
    "categoryId": "c97988am534vak585p660epy",
    "categorySlug": "pistolety-dlya-sylikonu",
    "categoryNameUk": "Пістолети для силікону",
    "categoryNameRu": "Пистолеты для силикона",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:42.131Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "rww74woge4i1mtnlym3j0ixr": {
    "categoryId": "rww74woge4i1mtnlym3j0ixr",
    "categorySlug": "prystroyi-dlya-nanesennya-shtukaturky",
    "categoryNameUk": "Пристрої для нанесення штукатурки",
    "categoryNameRu": "Устройства для нанесения штукатурки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:42.202Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "hsmavw5aiwrov8d7e19nnzi3": {
    "categoryId": "hsmavw5aiwrov8d7e19nnzi3",
    "categorySlug": "tsykli-i-polotna-po-hipsokartonu",
    "categoryNameUk": "Циклі і полотна по гіпсокартону",
    "categoryNameRu": "Цикли и полотна по гипсокартону",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:42.275Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "m0icoao5wcjf9uk7h3f4sbog": {
    "categoryId": "m0icoao5wcjf9uk7h3f4sbog",
    "categorySlug": "likhtari",
    "categoryNameUk": "Ліхтарі",
    "categoryNameRu": "Фонари",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:42.355Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "ijzpnimm913tjjdkmvqmzsba": {
    "categoryId": "ijzpnimm913tjjdkmvqmzsba",
    "categorySlug": "1-0-0-5",
    "categoryNameUk": "1,0/0,5",
    "categoryNameRu": "1,0/0,5",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:42.432Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "i3jbfsiwea8bxdzpxsc8qpn1": {
    "categoryId": "i3jbfsiwea8bxdzpxsc8qpn1",
    "categorySlug": "nakopychuvachi-informatsiyi",
    "categoryNameUk": "Накопичувачі інформації",
    "categoryNameRu": "Накопители информации",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:42.512Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "a8dgi91fbestj7ctfbc4ukx3": {
    "categoryId": "a8dgi91fbestj7ctfbc4ukx3",
    "categorySlug": "nozhivky-ta-stusla",
    "categoryNameUk": "Ножівки та стусла",
    "categoryNameRu": "Ножовки и стусла",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:42.589Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ws5o6dvtwkyoafrz51z2y08a": {
    "categoryId": "ws5o6dvtwkyoafrz51z2y08a",
    "categorySlug": "pistolety-kleyovi",
    "categoryNameUk": "Пістолети клейові",
    "categoryNameRu": "Пистолеты клеевые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:42.751Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "oyn9xf8tbb0gp69nno3eft1r": {
    "categoryId": "oyn9xf8tbb0gp69nno3eft1r",
    "categorySlug": "skoby-dlya-pnevmatychnoho-steplera",
    "categoryNameUk": "Скоби для пневматичного степлера",
    "categoryNameRu": "Скобы для пневматического степлера",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:42.895Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "aly6b0eazzsz69cqtk75ol4h": {
    "categoryId": "aly6b0eazzsz69cqtk75ol4h",
    "categorySlug": "steplery-mekhanichni",
    "categoryNameUk": "Степлери механічні",
    "categoryNameRu": "Степлеры механические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:43.038Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "b467vq58cd8jifjtl5emqclw": {
    "categoryId": "b467vq58cd8jifjtl5emqclw",
    "categorySlug": "yashchyky-dlya-instrumentiv",
    "categoryNameUk": "Ящики для інструментів",
    "categoryNameRu": "Ящики для инструментов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:43.117Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ghcp84ykgq4fkhmzkkycurde": {
    "categoryId": "ghcp84ykgq4fkhmzkkycurde",
    "categorySlug": "orhanayzery-dlya-instrumentiv",
    "categoryNameUk": "Органайзери для інструментів",
    "categoryNameRu": "Органайзеры для инструментов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:43.198Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "f0j3e69c1gcsnzqxadwn8bup": {
    "categoryId": "f0j3e69c1gcsnzqxadwn8bup",
    "categorySlug": "sumky-dlya-instrumentiv",
    "categoryNameUk": "Сумки для інструментів",
    "categoryNameRu": "Сумки для инструментов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:43.278Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "t4dasequdqqlnnytndymszdy": {
    "categoryId": "t4dasequdqqlnnytndymszdy",
    "categorySlug": "vizky-dlya-instrumentiv",
    "categoryNameUk": "Візки для інструментів",
    "categoryNameRu": "Тележки для инструментов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:43.351Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "x6ka9khg3q1va4c96racqpcp": {
    "categoryId": "x6ka9khg3q1va4c96racqpcp",
    "categorySlug": "polytsi-dlya-instrumentiv",
    "categoryNameUk": "Полиці для інструментів",
    "categoryNameRu": "Полки для инструментов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:43.426Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "xpigke8u1j6f4e34t5awpx80": {
    "categoryId": "xpigke8u1j6f4e34t5awpx80",
    "categorySlug": "poyasy-fartukhy-kysheni-dlya-instrumentiv",
    "categoryNameUk": "Пояси, фартухи , кишені для інструментів",
    "categoryNameRu": "Пояса, фартуки, карманы для инструментов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:43.498Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "ui1nfcowx9pgw0k1yonnq49u": {
    "categoryId": "ui1nfcowx9pgw0k1yonnq49u",
    "categorySlug": "dryli-bezudarni",
    "categoryNameUk": "Дрилі безударні",
    "categoryNameRu": "Дрели безударные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:44.006Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "x347jhj691me64fieaj4ozgs": {
    "categoryId": "x347jhj691me64fieaj4ozgs",
    "categorySlug": "pylky-dyskovi",
    "categoryNameUk": "Пилки дискові",
    "categoryNameRu": "Пилки дисковые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:44.084Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "azyhxlpt6lg3tj8e1ictxvgh": {
    "categoryId": "azyhxlpt6lg3tj8e1ictxvgh",
    "categorySlug": "shlifmashyny-ekstsentrykovi-pnevmatychni",
    "categoryNameUk": "Шліфмашини ексцентрикові пневматичні",
    "categoryNameRu": "Шлифмашины эксцентриковые пневматические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:44.371Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "iwxaypzwwxzmlij05k43w2he": {
    "categoryId": "iwxaypzwwxzmlij05k43w2he",
    "categorySlug": "shlanhy-vysokoho-tysku-v-bukhtakh",
    "categoryNameUk": "Шланги високого тиску в бухтах",
    "categoryNameRu": "Шланги высокого давления в бухтах",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:44.443Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "k4tv99uvultuf07hehdibxvx": {
    "categoryId": "k4tv99uvultuf07hehdibxvx",
    "categorySlug": "shlanhy-vysokoho-tysku-spiralni",
    "categoryNameUk": "Шланги високого тиску спіральні",
    "categoryNameRu": "Шланги высокого давления спиральные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:44.531Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "icv66jk1a90jv4ddupq0vrmz": {
    "categoryId": "icv66jk1a90jv4ddupq0vrmz",
    "categorySlug": "rivni-lazerni",
    "categoryNameUk": "Рівні лазерні",
    "categoryNameRu": "Уровни лазерные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:44.611Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "m2qjnnrczyeo4c3ulxwqnlns": {
    "categoryId": "m2qjnnrczyeo4c3ulxwqnlns",
    "categorySlug": "lazerni-dalekomiry-lazerni-ruletky",
    "categoryNameUk": "Лазерні далекоміри (лазерні рулетки)",
    "categoryNameRu": "Лазерные дальномеры (лазерные рулетки)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:44.683Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "uzalrf7nyl258zrn06fjeh5s": {
    "categoryId": "uzalrf7nyl258zrn06fjeh5s",
    "categorySlug": "niveliry-optychni",
    "categoryNameUk": "Нівеліри оптичні",
    "categoryNameRu": "Нивелиры оптические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:44.752Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "p0h213ddqkan6csbr4nisvv5": {
    "categoryId": "p0h213ddqkan6csbr4nisvv5",
    "categorySlug": "shtatyvy-dlya-niveliriv",
    "categoryNameUk": "Штативи для нівелірів",
    "categoryNameRu": "Штативы для нивелиров",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:44.833Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "hwmop99ylovw33969m4dg0qg": {
    "categoryId": "hwmop99ylovw33969m4dg0qg",
    "categorySlug": "navskisnyky",
    "categoryNameUk": "Навскісники",
    "categoryNameRu": "Накосники",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:44.904Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "ts47gjnrsbz4x9d2fgwy2b9b": {
    "categoryId": "ts47gjnrsbz4x9d2fgwy2b9b",
    "categorySlug": "nozhivky-po-hipsokartonu-i-pinobetonu",
    "categoryNameUk": "Ножівки по гіпсокартону і пінобетону",
    "categoryNameRu": "Ножовки по гипсокартону и пенобетону",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:44.978Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "gjnczy0kh7sjo2iztapnwk6a": {
    "categoryId": "gjnczy0kh7sjo2iztapnwk6a",
    "categorySlug": "nozhivky-po-metalu",
    "categoryNameUk": "Ножівки по металу",
    "categoryNameRu": "Ножовки по металлу",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.050Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "irxju636ijwcmqse2j3xauws": {
    "categoryId": "irxju636ijwcmqse2j3xauws",
    "categorySlug": "polotna-nozhivkovi-po-derevu-ta-metalu",
    "categoryNameUk": "Полотна ножівкові по дереву та металу",
    "categoryNameRu": "Полотна ножовочные по дереву и металлу",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.122Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "knf2c8hrte0x2l2f562dgkuz": {
    "categoryId": "knf2c8hrte0x2l2f562dgkuz",
    "categorySlug": "klyuchi-trubni",
    "categoryNameUk": "Ключі трубні",
    "categoryNameRu": "Ключи трубные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.197Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "nzdk7gdfrw17ewjeju7b1zn8": {
    "categoryId": "nzdk7gdfrw17ewjeju7b1zn8",
    "categorySlug": "plashky-i-mitchyky",
    "categoryNameUk": "Плашки і мітчики",
    "categoryNameRu": "Плашки и метчики",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.274Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "fie5tebsh1lpcwfeju6to7ry": {
    "categoryId": "fie5tebsh1lpcwfeju6to7ry",
    "categorySlug": "leshchata",
    "categoryNameUk": "Лещата",
    "categoryNameRu": "Тиски",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.350Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mjcrir2f2br3l86qvvz5zcez": {
    "categoryId": "mjcrir2f2br3l86qvvz5zcez",
    "categorySlug": "kruhlohubtsi",
    "categoryNameUk": "Круглогубці",
    "categoryNameRu": "Круглогубцы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.421Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "tem9yjb1omrd137x6iri3ian": {
    "categoryId": "tem9yjb1omrd137x6iri3ian",
    "categorySlug": "bokorizy",
    "categoryNameUk": "Бокорізи",
    "categoryNameRu": "Бокорезы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.495Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "tsn76fnbejs3cgdxe0rt8ri6": {
    "categoryId": "tsn76fnbejs3cgdxe0rt8ri6",
    "categorySlug": "kusachky-znimachi-izolyatsiyi",
    "categoryNameUk": "Кусачки, знімачі ізоляції",
    "categoryNameRu": "Кусачки, съемники изоляции",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.568Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "wazb87tkljaofu3obdh64vqk": {
    "categoryId": "wazb87tkljaofu3obdh64vqk",
    "categorySlug": "elektrooladnannya",
    "categoryNameUk": "Електрооладнання",
    "categoryNameRu": "Электрооборудование",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.648Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "y88ctqs71rn3uhzlrbhyhebd": {
    "categoryId": "y88ctqs71rn3uhzlrbhyhebd",
    "categorySlug": "kontrol-dostupu",
    "categoryNameUk": "Контроль доступу",
    "categoryNameRu": "Контроль доступа",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.727Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "a0ynk0b5uvx3kbcidgq0gg60": {
    "categoryId": "a0ynk0b5uvx3kbcidgq0gg60",
    "categorySlug": "nozhytsi-po-metalu",
    "categoryNameUk": "Ножиці по металу",
    "categoryNameRu": "Ножницы по металлу",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.802Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "b9nontowtff8eouajmhiopla": {
    "categoryId": "b9nontowtff8eouajmhiopla",
    "categorySlug": "passatyzhy",
    "categoryNameUk": "Пассатижи",
    "categoryNameRu": "Пассатижи",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.873Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "grhcw8tkii6ieatgj80h12bb": {
    "categoryId": "grhcw8tkii6ieatgj80h12bb",
    "categorySlug": "ploskohubtsi",
    "categoryNameUk": "Плоскогубці",
    "categoryNameRu": "Плоскогубцы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:45.947Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ne05fn3dev5v4kunqzbx69yg": {
    "categoryId": "ne05fn3dev5v4kunqzbx69yg",
    "categorySlug": "dovhohubtsi",
    "categoryNameUk": "Довгогубці",
    "categoryNameRu": "Длинногубцы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.021Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "i64770y4aagkp0luzai1c2ga": {
    "categoryId": "i64770y4aagkp0luzai1c2ga",
    "categorySlug": "maklovytsi",
    "categoryNameUk": "Макловиці",
    "categoryNameRu": "Макловицы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.092Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "a2ywq5fzcn9ush71hkrx090r": {
    "categoryId": "a2ywq5fzcn9ush71hkrx090r",
    "categorySlug": "strichka-malyarska-plivka-zakhysna",
    "categoryNameUk": "Стрічка малярська, плівка захисна",
    "categoryNameRu": "Лента малярная, пленка защитная",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.233Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "p9u7jndnijeg3vpz3etqm4is": {
    "categoryId": "p9u7jndnijeg3vpz3etqm4is",
    "categorySlug": "nozhi-elektryka",
    "categoryNameUk": "Ножі електрика",
    "categoryNameRu": "Ножи электрика",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.307Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "uga7btyj4poirw9k3fa9mujk": {
    "categoryId": "uga7btyj4poirw9k3fa9mujk",
    "categorySlug": "leza-dlya-nozhiv",
    "categoryNameUk": "Леза для ножів",
    "categoryNameRu": "Лезвия для ножей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.381Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "rlwukn5pprmd5pu177klz9lw": {
    "categoryId": "rlwukn5pprmd5pu177klz9lw",
    "categorySlug": "brusky-shlifuvalni",
    "categoryNameUk": "Бруски шліфувальні",
    "categoryNameRu": "Бруски шлифовальные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.453Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "vliji6468xusaldo2gv12pnm": {
    "categoryId": "vliji6468xusaldo2gv12pnm",
    "categorySlug": "kameni-shlifuvalni-dlya-dryliv",
    "categoryNameUk": "Камені шліфувальні для дрилів",
    "categoryNameRu": "Камни шлифовальные для дрелей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.527Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "xpvi51brozlapeqotg9p0ttv": {
    "categoryId": "xpvi51brozlapeqotg9p0ttv",
    "categorySlug": "dysky-dlya-nazhdachnoho-paperu",
    "categoryNameUk": "Диски для наждачного паперу",
    "categoryNameRu": "Диски для наждачной бумаги",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.595Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "yp9wfdb62r6ga51pkwkhfqoq": {
    "categoryId": "yp9wfdb62r6ga51pkwkhfqoq",
    "categorySlug": "strichky-shlifuvalni",
    "categoryNameUk": "Стрічки шліфувальні",
    "categoryNameRu": "Ленты шлифовальные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.672Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "b5tow8pwr4vvvg0wqy61jvn3": {
    "categoryId": "b5tow8pwr4vvvg0wqy61jvn3",
    "categorySlug": "shkurky-shlifuvalni",
    "categoryNameUk": "Шкурки шліфувальні",
    "categoryNameRu": "Шкурки шліфувальні",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.745Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "t6ddyiwcxj0kpyk71wkj0zsr": {
    "categoryId": "t6ddyiwcxj0kpyk71wkj0zsr",
    "categorySlug": "kleyovi-stryzhni",
    "categoryNameUk": "Клейові стрижні",
    "categoryNameRu": "Клеевые стержни",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.821Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "zefc667gy0ssh0rxzs950kto": {
    "categoryId": "zefc667gy0ssh0rxzs950kto",
    "categorySlug": "payalnyky-kontaktni",
    "categoryNameUk": "Паяльники контактні",
    "categoryNameRu": "Паяльники контактные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.892Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "omip38iqgvyk9f4wr2m6zlcg": {
    "categoryId": "omip38iqgvyk9f4wr2m6zlcg",
    "categorySlug": "payalnyky-hazovi",
    "categoryNameUk": "Паяльники газові",
    "categoryNameRu": "Паяльники газовые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:46.965Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "jdaizc9ntclj9m65g69swcw2": {
    "categoryId": "jdaizc9ntclj9m65g69swcw2",
    "categorySlug": "payalnyky-dlya-plastykov-kh-trub",
    "categoryNameUk": "Паяльники для пластиковых труб",
    "categoryNameRu": "Паяльники для пластиковых труб",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:47.037Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "chhforkirmkbb6rjlwrjcd98": {
    "categoryId": "chhforkirmkbb6rjlwrjcd98",
    "categorySlug": "payalnyky-impulsni",
    "categoryNameUk": "Паяльники імпульсні",
    "categoryNameRu": "Паяльники импульсные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:47.107Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "kb0kmqgn0jr7xltq3jw15scv": {
    "categoryId": "kb0kmqgn0jr7xltq3jw15scv",
    "categorySlug": "kuvaldy",
    "categoryNameUk": "Кувалди",
    "categoryNameRu": "Кувалды",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:47.176Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "ugp7dg7zgsc1wyz22yfzjpre": {
    "categoryId": "ugp7dg7zgsc1wyz22yfzjpre",
    "categorySlug": "rukavychky-robochi-v-yazani",
    "categoryNameUk": "Рукавички робочі в'язані",
    "categoryNameRu": "Перчатки рабочие вязаные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:47.248Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ex1l8w2lgsypf8gjxik41tgq": {
    "categoryId": "ex1l8w2lgsypf8gjxik41tgq",
    "categorySlug": "rukavychky-robochi-shkiryani-i-zamshevi",
    "categoryNameUk": "Рукавички робочі шкіряні і замшеві",
    "categoryNameRu": "Перчатки рабочие кожаные и замшевые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:47.407Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "xjhoen52e78nt3f5yc8bg8jg": {
    "categoryId": "xjhoen52e78nt3f5yc8bg8jg",
    "categorySlug": "shchitky-dlya-dryliv",
    "categoryNameUk": "Щітки для дрилів",
    "categoryNameRu": "Щетки для дрелей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:47.478Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "vhcfh1niwxnvvnnlk3g6lu0g": {
    "categoryId": "vhcfh1niwxnvvnnlk3g6lu0g",
    "categorySlug": "vytratni-materialy-do-budivelnykh-pylososiv",
    "categoryNameUk": "Витратні матеріали до будівельних пилососів",
    "categoryNameRu": "Расходные материалы к строительным пылесосам",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:47.696Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "xuc739y1bqx85svinfuw42rs": {
    "categoryId": "xuc739y1bqx85svinfuw42rs",
    "categorySlug": "akumulyatory-dlya-instrumentu",
    "categoryNameUk": "Акумулятори для інструменту",
    "categoryNameRu": "Аккумуляторы для инструмента",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:47.772Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "svb8t59ow665lggoufawpp5s": {
    "categoryId": "svb8t59ow665lggoufawpp5s",
    "categorySlug": "prystosuvannya-dlya-ushm",
    "categoryNameUk": "Пристосування для УШМ",
    "categoryNameRu": "Приспособления для УШМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:47.848Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "lf5e9pslnxy94i1h8xlrwvbc": {
    "categoryId": "lf5e9pslnxy94i1h8xlrwvbc",
    "categorySlug": "dysky-zachysni-po-metalu-dlya-ushm",
    "categoryNameUk": "Диски зачисні по металу для УШМ",
    "categoryNameRu": "Диски зачисні по металу для УШМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:47.926Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "phwlnqia5ehgd473i1pk7gp1": {
    "categoryId": "phwlnqia5ehgd473i1pk7gp1",
    "categorySlug": "dysky-shlifuvalni-dlya-ushm",
    "categoryNameUk": "Диски шліфувальні для УШМ",
    "categoryNameRu": "Диски шліфувальні для УШМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:48.000Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "gnmk8qidknxwie1n817w2eo2": {
    "categoryId": "gnmk8qidknxwie1n817w2eo2",
    "categorySlug": "dysky-pylyalni-po-derevu",
    "categoryNameUk": "Диски пиляльні по дереву",
    "categoryNameRu": "Диски пиляльні по дереву",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:48.077Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "tku3kjdqt728d3p86u3lehnf": {
    "categoryId": "tku3kjdqt728d3p86u3lehnf",
    "categorySlug": "klishchi-dlya-obtysku-kontaktiv",
    "categoryNameUk": "Кліщі для обтиску контактів",
    "categoryNameRu": "Клещи для обжима контактов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:48.149Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "tlgxd9hln5qnuaol4d7a938v": {
    "categoryId": "tlgxd9hln5qnuaol4d7a938v",
    "categorySlug": "farbopulty-pnevmatychni-hp",
    "categoryNameUk": "Фарбопульти пневматичні HP",
    "categoryNameRu": "Фарбопульты пневматические HP",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:48.224Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "i7v74b0t3uy3thj0ud0xswws": {
    "categoryId": "i7v74b0t3uy3thj0ud0xswws",
    "categorySlug": "farbopulty-pnevmatychni-hvlp",
    "categoryNameUk": "Фарбопульти пневматичні HVLP",
    "categoryNameRu": "Пневматические краснопульты HVLP",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:48.299Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "zdogkk7bhvl3ng38ishchkv8": {
    "categoryId": "zdogkk7bhvl3ng38ishchkv8",
    "categorySlug": "farbopulty-pnevmatychni-lvlp",
    "categoryNameUk": "Фарбопульти пневматичні LVLP",
    "categoryNameRu": "Пневматические краснопульты LVLP",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:48.373Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "i9r42ea6dygrr6ztxmg2lt0b": {
    "categoryId": "i9r42ea6dygrr6ztxmg2lt0b",
    "categorySlug": "izolovani-vykrutky",
    "categoryNameUk": "Ізольовані викрутки",
    "categoryNameRu": "Изолированные отвертки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:48.448Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "avurxkcy0ttu38n62kuopawk": {
    "categoryId": "avurxkcy0ttu38n62kuopawk",
    "categorySlug": "vykrutky-khrestovi",
    "categoryNameUk": "Викрутки хрестові",
    "categoryNameRu": "Отвертки крестовые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:48.532Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "msshaup7yb218t5xuhz3iv6c": {
    "categoryId": "msshaup7yb218t5xuhz3iv6c",
    "categorySlug": "vykrutky-reversyvni",
    "categoryNameUk": "Викрутки реверсивні",
    "categoryNameRu": "Отвертки реверсивные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:48.607Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "y6tu5qdpryp2dw4rt29zlje8": {
    "categoryId": "y6tu5qdpryp2dw4rt29zlje8",
    "categorySlug": "nabory-vykrutok",
    "categoryNameUk": "Набори викруток",
    "categoryNameRu": "Наборы отверток",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:48.685Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "lgb887ybwtziov2qqkkwc7re": {
    "categoryId": "lgb887ybwtziov2qqkkwc7re",
    "categorySlug": "vykrutky-z-naboramy-otvertochnykh-nasadok",
    "categoryNameUk": "Викрутки з наборами отверточних насадок",
    "categoryNameRu": "Викрутки з наборами отверточних насадок",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:48.762Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "w1mpop9skje75b7usoxsswlg": {
    "categoryId": "w1mpop9skje75b7usoxsswlg",
    "categorySlug": "materialy-dlya-kriplennya",
    "categoryNameUk": "Матеріали для кріплення",
    "categoryNameRu": "Материалы для крепления",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.069Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "cjdjgu9o7upvw3js1vhee6yr": {
    "categoryId": "cjdjgu9o7upvw3js1vhee6yr",
    "categorySlug": "fazometry-ta-indykatory-napruhy",
    "categoryNameUk": "Фазометри та індикатори напруги",
    "categoryNameRu": "Фазометры и индикаторы напряжения",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.144Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "cku5vhc6f17kywwv4wrp6yfy": {
    "categoryId": "cku5vhc6f17kywwv4wrp6yfy",
    "categorySlug": "klishchi-dlya-plytky",
    "categoryNameUk": "Кліщі для плитки",
    "categoryNameRu": "Клещи для плитки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.214Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "p7cbw8lqnh2jqk4qsu5d6s41": {
    "categoryId": "p7cbw8lqnh2jqk4qsu5d6s41",
    "categorySlug": "klishchi-zatyskni",
    "categoryNameUk": "Кліщі затискні",
    "categoryNameRu": "Клещи зажимные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.289Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "glaqkmfm2cola81o155kh8iz": {
    "categoryId": "glaqkmfm2cola81o155kh8iz",
    "categorySlug": "klishchi-santekhnichni",
    "categoryNameUk": "Кліщі сантехнічні",
    "categoryNameRu": "Клещи сантехнические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.365Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "rjnv16yxzwibg4lx803289te": {
    "categoryId": "rjnv16yxzwibg4lx803289te",
    "categorySlug": "kysti-fleytsevi",
    "categoryNameUk": "Кисті флейцеві",
    "categoryNameRu": "Кисти флейцевые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.437Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "p0zfbz5d8tgc0t8zfm2ueuug": {
    "categoryId": "p0zfbz5d8tgc0t8zfm2ueuug",
    "categorySlug": "materialy-vydatkovi-dlya-payalnykiv-impulsnykh",
    "categoryNameUk": "Матеріали видаткові для паяльників імпульсних",
    "categoryNameRu": "Материалы расходные для паяльников импульсных",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.513Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "fji79pwmcjmi5ixbyzn49xfr": {
    "categoryId": "fji79pwmcjmi5ixbyzn49xfr",
    "categorySlug": "shchitky-kiltsevi-dlya-ushm",
    "categoryNameUk": "Щітки кільцеві для УШМ",
    "categoryNameRu": "Щетки кольцевые для УШМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.583Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "t1kxtjcns9wxf05ij3ebhnae": {
    "categoryId": "t1kxtjcns9wxf05ij3ebhnae",
    "categorySlug": "shchitky-konusni-dlya-ushm",
    "categoryNameUk": "Щітки конусні для УШМ",
    "categoryNameRu": "Щетки конусные для УШМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.652Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "i8gtevwccny3cwpcly6dsdm5": {
    "categoryId": "i8gtevwccny3cwpcly6dsdm5",
    "categorySlug": "shchitky-chashkovi-dlya-ushm",
    "categoryNameUk": "Щітки чашкові для УШМ",
    "categoryNameRu": "Щетки чашечные для УШМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.724Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "iy5ktjuagfclls3koq6d7njd": {
    "categoryId": "iy5ktjuagfclls3koq6d7njd",
    "categorySlug": "dysky-vidrizni-po-metalu-dlya-ushm",
    "categoryNameUk": "Диски відрізні по металу для УШМ",
    "categoryNameRu": "Диски відрізні по металу для УШМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.794Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "x949gd63mmqqqxnb5tuwnasd": {
    "categoryId": "x949gd63mmqqqxnb5tuwnasd",
    "categorySlug": "valyky-z-ruchkoyu",
    "categoryNameUk": "Валики з ручкою",
    "categoryNameRu": "Валики с ручкой",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:49.868Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "k8bw08q4rhoo7gpaalus4gw2": {
    "categoryId": "k8bw08q4rhoo7gpaalus4gw2",
    "categorySlug": "pv-drit-vinilovyy",
    "categoryNameUk": "ПВ (дріт вініловий)",
    "categoryNameRu": "ПВ (провод виниловый)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:50.011Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "xffmimgqein7t9yx2zkiml3a": {
    "categoryId": "xffmimgqein7t9yx2zkiml3a",
    "categorySlug": "mastyla-tekhnichni",
    "categoryNameUk": "Мастила технічні",
    "categoryNameRu": "Масла технические",
    "params": {
      "distBlock": 0,
      "floorShadowY": 0.85,
      "minHoleSize": 99999
    },
    "calibratedAt": "2026-06-02T19:01:50.085Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "jfbt9pu3dlrgk50ot3mxtio7": {
    "categoryId": "jfbt9pu3dlrgk50ot3mxtio7",
    "categorySlug": "nabory-haykovykh-klyuchiv",
    "categoryNameUk": "Набори гайкових ключів",
    "categoryNameRu": "Наборы гаечных ключей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:50.159Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "u33pn5gswyysad19joc6pu45": {
    "categoryId": "u33pn5gswyysad19joc6pu45",
    "categorySlug": "videokamery",
    "categoryNameUk": "Відеокамери",
    "categoryNameRu": "Видеокамеры",
    "params": {
      "distBlock": 2,
      "floorShadowY": 0.85,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:50.234Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "x48eccbmvxq6rasp183jp5nw": {
    "categoryId": "x48eccbmvxq6rasp183jp5nw",
    "categorySlug": "nabory-tortsevykh-holovok-shestyhrannykiv-ta-zirok",
    "categoryNameUk": "Набори торцевих головок шестигранників та зірок",
    "categoryNameRu": "Наборы торцевых головок шестигранников и звезд",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:50.377Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "mnym6yzhv4oqpyx79w8yl4ce": {
    "categoryId": "mnym6yzhv4oqpyx79w8yl4ce",
    "categorySlug": "truborizy-1",
    "categoryNameUk": "Труборізи",
    "categoryNameRu": "Труборезы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:50.450Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "g0mu0qpg3zcy3bj86vbhmk29": {
    "categoryId": "g0mu0qpg3zcy3bj86vbhmk29",
    "categorySlug": "nabory-zirok-i-shestyhrannykiv",
    "categoryNameUk": "Набори зірок і шестигранників",
    "categoryNameRu": "Наборы звезд и шестигранников",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:50.589Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "vopab2hoz1ocja8t7j7jp7gx": {
    "categoryId": "vopab2hoz1ocja8t7j7jp7gx",
    "categorySlug": "shestyhrannyky-v-trymachi",
    "categoryNameUk": "Шестигранники в тримачі",
    "categoryNameRu": "Шестигранники в держателе",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:50.659Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "wab4n2iii75hc3hg1hdrpxjb": {
    "categoryId": "wab4n2iii75hc3hg1hdrpxjb",
    "categorySlug": "klyuchi-dynamometrychni",
    "categoryNameUk": "Ключі динамометричні",
    "categoryNameRu": "Ключи динамометрические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:50.730Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "cw25u4a1v0m359zt1mq89naj": {
    "categoryId": "cw25u4a1v0m359zt1mq89naj",
    "categorySlug": "klyuchi-balonni",
    "categoryNameUk": "Ключі балонні",
    "categoryNameRu": "Ключи баллонные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:50.871Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "jqby9ogiujqqotddkxacvuln": {
    "categoryId": "jqby9ogiujqqotddkxacvuln",
    "categorySlug": "puskovi-droty",
    "categoryNameUk": "Пускові дроти",
    "categoryNameRu": "Пусковые провода",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:50.941Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "nqzghtokase7qp5tvz9c2u9r": {
    "categoryId": "nqzghtokase7qp5tvz9c2u9r",
    "categorySlug": "prystroyi-zaryadni-dlya-akb",
    "categoryNameUk": "Пристрої зарядні для АКБ",
    "categoryNameRu": "Устройства зарядные для АКБ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:51.011Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "gteiv2ndqzi97lax5swxuj6x": {
    "categoryId": "gteiv2ndqzi97lax5swxuj6x",
    "categorySlug": "shprytsy-dlya-zmashchennya-i-zatoky-masla",
    "categoryNameUk": "Шприци для змащення і затоки масла",
    "categoryNameRu": "Шприцы и инструмент для жидкостей автомото",
    "params": {
      "distBlock": 0,
      "floorShadowY": 0.85,
      "minHoleSize": 99999
    },
    "calibratedAt": "2026-06-02T19:01:51.084Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "bxrpe461c083vs5wiqrj0yzg": {
    "categoryId": "bxrpe461c083vs5wiqrj0yzg",
    "categorySlug": "styazhky-dlya-pruzhyn",
    "categoryNameUk": "Стяжки для пружин",
    "categoryNameRu": "Стяжки для пружин",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:51.163Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "idx7b0pgrt84535vj662e2yg": {
    "categoryId": "idx7b0pgrt84535vj662e2yg",
    "categorySlug": "znimachi-maslyanykh-filtriv",
    "categoryNameUk": "Знімачі масляних фільтрів",
    "categoryNameRu": "Съемники масляных фильтров",
    "params": {
      "distBlock": 0,
      "floorShadowY": 0.85,
      "minHoleSize": 99999
    },
    "calibratedAt": "2026-06-02T19:01:51.236Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "yu84h6jvrtdexn6mf1u7l57n": {
    "categoryId": "yu84h6jvrtdexn6mf1u7l57n",
    "categorySlug": "trymachi-prysosky-dlya-stekol",
    "categoryNameUk": "Тримачі - присоски для стекол",
    "categoryNameRu": "Держатели – присоски для стекол",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:51.312Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "ukbc6jtxu0b7711lw1rf0zgp": {
    "categoryId": "ukbc6jtxu0b7711lw1rf0zgp",
    "categorySlug": "salnyky-humovi",
    "categoryNameUk": "Сальники гумові",
    "categoryNameRu": "Сальники резиновые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:51.383Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "rg5sflz8jw7bngeovdbv0vk5": {
    "categoryId": "rg5sflz8jw7bngeovdbv0vk5",
    "categorySlug": "klyuchi-balonni-i-l-obrazni",
    "categoryNameUk": "Ключі балонні I-, L- образні",
    "categoryNameRu": "Ключи баллонные I-, L-образные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:51.461Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "si424da8drid0zxxclp7sc4t": {
    "categoryId": "si424da8drid0zxxclp7sc4t",
    "categorySlug": "klyuchi-haykovi-tortsevi",
    "categoryNameUk": "Ключі гайкові торцеві",
    "categoryNameRu": "Ключи гаечные торцевые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:51.531Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "gcl1iiw7vksqs6a20tx06xio": {
    "categoryId": "gcl1iiw7vksqs6a20tx06xio",
    "categorySlug": "pvs-drit-vinilovyy-z-yednuvalnyy",
    "categoryNameUk": "ПВС (дріт вініловий з'єднувальний)",
    "categoryNameRu": "ПВС (провод виниловый соединительный)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:51.609Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "klq15kvogqep7ia928zf6m4b": {
    "categoryId": "klq15kvogqep7ia928zf6m4b",
    "categorySlug": "nakonechnyky-1",
    "categoryNameUk": "Наконечники",
    "categoryNameRu": "Наконечники ECO",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:51.688Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "m85275s5ifth39oinrkkxgst": {
    "categoryId": "m85275s5ifth39oinrkkxgst",
    "categorySlug": "shvvp-shnur-vinil-vinil-ploskyy",
    "categoryNameUk": "ШВВП (Шнур вініл-вініл плоский)",
    "categoryNameRu": "ШВВП (Шнур винил-винил плоский)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:51.764Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "irq5n3jfllfi9m5hd3mu9twf": {
    "categoryId": "irq5n3jfllfi9m5hd3mu9twf",
    "categorySlug": "kabelni-nakonechnyky-midni",
    "categoryNameUk": "Кабельні наконечники мідні",
    "categoryNameRu": "Кабельные наконечники медные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:51.903Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "xuks9ma5ksxford9ira8smfb": {
    "categoryId": "xuks9ma5ksxford9ira8smfb",
    "categorySlug": "prysadochni-prutky-gradient",
    "categoryNameUk": "Присадочні прутки Gradient",
    "categoryNameRu": "Присадочные прутки Gradient",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:52.483Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "dv8gokt4hqibc1urzr0trncd": {
    "categoryId": "dv8gokt4hqibc1urzr0trncd",
    "categorySlug": "almaznyy-dysk",
    "categoryNameUk": "Алмазний диск",
    "categoryNameRu": "Алмазный круг",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:52.627Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "bqe59rmozi8d27h47gan4lcy": {
    "categoryId": "bqe59rmozi8d27h47gan4lcy",
    "categorySlug": "kruhy-pelyustkovi-tortsevi-kpt",
    "categoryNameUk": "Круги пелюсткові торцеві (КПТ)",
    "categoryNameRu": "Круги лепестковые торцевые (КПТ)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:52.768Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "xfpj0avzcklws4i441zbt8m1": {
    "categoryId": "xfpj0avzcklws4i441zbt8m1",
    "categorySlug": "shkafy-metalevi",
    "categoryNameUk": "Шкафи металеві",
    "categoryNameRu": "Шкафы монтажные металлические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:52.841Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "uf5w524mp8uk4xs2wgjje7lf": {
    "categoryId": "uf5w524mp8uk4xs2wgjje7lf",
    "categorySlug": "zvaryuvalni-masky",
    "categoryNameUk": "Зварювальні маски",
    "categoryNameRu": "Сварочные маски",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:52.986Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "xy06tbt1dhoad4pn0dmaxu2n": {
    "categoryId": "xy06tbt1dhoad4pn0dmaxu2n",
    "categorySlug": "zvaryuvalnyy-odyah",
    "categoryNameUk": "Зварювальний одяг",
    "categoryNameRu": "Сварочная одежда",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.056Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "tlau67j8uckfp7uhbhu14tz3": {
    "categoryId": "tlau67j8uckfp7uhbhu14tz3",
    "categorySlug": "merezhevyy-kabel",
    "categoryNameUk": "Мережевий кабель",
    "categoryNameRu": "Сетевой Кабель",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.197Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "owlfm2pcnzvpf7flnsb3gbx2": {
    "categoryId": "owlfm2pcnzvpf7flnsb3gbx2",
    "categorySlug": "rele-napruhy",
    "categoryNameUk": "Реле напруги",
    "categoryNameRu": "Реле напряжения",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.273Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "irfuib82rag16kv81n9xbhed": {
    "categoryId": "irfuib82rag16kv81n9xbhed",
    "categorySlug": "klemy-mahnitni",
    "categoryNameUk": "Клеми магнітні",
    "categoryNameRu": "Клеммы магнитные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.345Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "k2tb3orw8gywgknebv40tdmp": {
    "categoryId": "k2tb3orw8gywgknebv40tdmp",
    "categorySlug": "bury-do-perforatoriv",
    "categoryNameUk": "Бури до перфораторів",
    "categoryNameRu": "Буры к перфораторам",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.415Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "u6hi4g8vkf27u8ug76xn3jjp": {
    "categoryId": "u6hi4g8vkf27u8ug76xn3jjp",
    "categorySlug": "detektory-provodky",
    "categoryNameUk": "Детектори проводки",
    "categoryNameRu": "Детекторы проводки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.486Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "aghbc9sqehhqdvjaf91cefug": {
    "categoryId": "aghbc9sqehhqdvjaf91cefug",
    "categorySlug": "tsvyakhy-dlya-steplera",
    "categoryNameUk": "Цвяхи для степлера",
    "categoryNameRu": "Гвозди для степлера",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.557Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "icwco50rwlglxkpid12pqf8c": {
    "categoryId": "icwco50rwlglxkpid12pqf8c",
    "categorySlug": "valiky",
    "categoryNameUk": "Валіки",
    "categoryNameRu": "Валики",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.625Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "v38y3gkwg6lu9e6g1f30q7ov": {
    "categoryId": "v38y3gkwg6lu9e6g1f30q7ov",
    "categorySlug": "avtoshampun",
    "categoryNameUk": "Автошампунь",
    "categoryNameRu": "Автошампунь",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.698Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "rcwep5zkrxc7hva9zzg3kdfl": {
    "categoryId": "rcwep5zkrxc7hva9zzg3kdfl",
    "categorySlug": "detali-do-myyok",
    "categoryNameUk": "Деталі до мийок",
    "categoryNameRu": "Детали к мойкам",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.768Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "czcciedklucl7uzgd3k8pxfv": {
    "categoryId": "czcciedklucl7uzgd3k8pxfv",
    "categorySlug": "avtomoyky",
    "categoryNameUk": "Автомойки",
    "categoryNameRu": "Автомойки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.840Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "i7dr9it700rf008p70ibwbsv": {
    "categoryId": "i7dr9it700rf008p70ibwbsv",
    "categorySlug": "nabir-pintsetiv",
    "categoryNameUk": "Набір пінцетів",
    "categoryNameRu": "Наборы пинцетов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:53.910Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "jqcw4f6l6byir497okyf6xa5": {
    "categoryId": "jqcw4f6l6byir497okyf6xa5",
    "categorySlug": "tekhnika-dlya-domu-ta-sadu",
    "categoryNameUk": "Техніка для дому та саду",
    "categoryNameRu": "Техника для дома и сада",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:54.050Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "xe6lal4p2ijlo39upshgotdw": {
    "categoryId": "xe6lal4p2ijlo39upshgotdw",
    "categorySlug": "avtoaksesuary",
    "categoryNameUk": "Автоаксесуари",
    "categoryNameRu": "Автоаксессуары",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:54.124Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "apali8merj3p6qeyctmi9p0m": {
    "categoryId": "apali8merj3p6qeyctmi9p0m",
    "categorySlug": "detali-myyok-vysokoho-tysku",
    "categoryNameUk": "Деталі мийок високого тиску",
    "categoryNameRu": "Детали моек высокого давления",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:54.196Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "usx1egfn83bxe649kghv4gnz": {
    "categoryId": "usx1egfn83bxe649kghv4gnz",
    "categorySlug": "pistolety-dlya-nakachuvannya-shyn-pnevmatychni",
    "categoryNameUk": "Пістолети для накачування шин пневматичні",
    "categoryNameRu": "Пистолеты для накачки шин пневматические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:54.273Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "lsg97s8im7sluftt1nx998bb": {
    "categoryId": "lsg97s8im7sluftt1nx998bb",
    "categorySlug": "ruletky",
    "categoryNameUk": "Рулетки",
    "categoryNameRu": "Рулетки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:54.361Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "jn0gvp9zl6jptalbvjp5iin7": {
    "categoryId": "jn0gvp9zl6jptalbvjp5iin7",
    "categorySlug": "pravyla",
    "categoryNameUk": "Правила",
    "categoryNameRu": "Правила",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:54.434Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "unowh4zjlonycyj5xkjx6gxs": {
    "categoryId": "unowh4zjlonycyj5xkjx6gxs",
    "categorySlug": "liniyky-budivelni",
    "categoryNameUk": "Лінійки будівельні",
    "categoryNameRu": "Линейки строительные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:54.505Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "delljmvi5ommma0e4wxug698": {
    "categoryId": "delljmvi5ommma0e4wxug698",
    "categorySlug": "instrument-dlya-plytky-i-skla",
    "categoryNameUk": "Інструмент для плитки і скла",
    "categoryNameRu": "Инструмент для плитки и стекла",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:54.655Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "l8lwsu9kg2agesbrabify4eo": {
    "categoryId": "l8lwsu9kg2agesbrabify4eo",
    "categorySlug": "klyuchi-rozvidni-mini",
    "categoryNameUk": "Ключі розвідні (міні)",
    "categoryNameRu": "Ключи разводные (мини)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:54.876Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "cdos1k4b5qgsh7p1x8qy7sqn": {
    "categoryId": "cdos1k4b5qgsh7p1x8qy7sqn",
    "categorySlug": "shchitky-zachysni-po-metalu",
    "categoryNameUk": "Щітки зачисні по металу",
    "categoryNameRu": "Щетки зачистные по металлу",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:55.023Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "x0a3u21mw8rknco59boj3jst": {
    "categoryId": "x0a3u21mw8rknco59boj3jst",
    "categorySlug": "1-5-0-75",
    "categoryNameUk": "1,5/0,75",
    "categoryNameRu": "1,5/0,75",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:55.162Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "ao9l7d5nm6uk9w10f341055i": {
    "categoryId": "ao9l7d5nm6uk9w10f341055i",
    "categorySlug": "izolyatsiyni-materialy",
    "categoryNameUk": "Ізоляційні матеріали",
    "categoryNameRu": "Изоляционные материалы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:55.307Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "e5ui20l2qwgmnr8nr61q8m47": {
    "categoryId": "e5ui20l2qwgmnr8nr61q8m47",
    "categorySlug": "nabory-zachyshchuvalnykh-shchitok-dlya-dryliv",
    "categoryNameUk": "Набори зачищувальних щіток для дрилів",
    "categoryNameRu": "Наборы щеток для дрели",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:55.377Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "rrh49n94qdpvr199833al2v3": {
    "categoryId": "rrh49n94qdpvr199833al2v3",
    "categorySlug": "shchitky-zachysni-kiltsevi-dlya-dryliv",
    "categoryNameUk": "Щітки зачисні кільцеві для дрилів",
    "categoryNameRu": "Щетки зачистные кольцевые для дрелей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:55.446Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "egwu3vgg7eiyqqz5m65vin19": {
    "categoryId": "egwu3vgg7eiyqqz5m65vin19",
    "categorySlug": "shchitky-zachysni-chashkovi-dlya-dryliv",
    "categoryNameUk": "Щітки зачисні чашкові для дрилів",
    "categoryNameRu": "Щетки зачистные чашечные для дрелей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:55.517Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "oejazpd56mw9mhe47vzcbnzd": {
    "categoryId": "oejazpd56mw9mhe47vzcbnzd",
    "categorySlug": "prynalezhnosti-do-motokos",
    "categoryNameUk": "Приналежності до мотокос",
    "categoryNameRu": "Принадлежности к мотокосам",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:55.594Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "f1icjq7v3f5l8f9q95x8jzcn": {
    "categoryId": "f1icjq7v3f5l8f9q95x8jzcn",
    "categorySlug": "pnevmosteplery",
    "categoryNameUk": "Пневмостеплери",
    "categoryNameRu": "Пневмостеплеры",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:55.663Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "eoyjz1pbzrhma9cf7bmabt8b": {
    "categoryId": "eoyjz1pbzrhma9cf7bmabt8b",
    "categorySlug": "strem-yanky",
    "categoryNameUk": "Стрем'янки",
    "categoryNameRu": "Стрем'янки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:55.814Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "nryrvrxfiz7sfrymb5styom6": {
    "categoryId": "nryrvrxfiz7sfrymb5styom6",
    "categorySlug": "shnury-rozmichalni",
    "categoryNameUk": "Шнури розмічальні",
    "categoryNameRu": "Шнуры разметочные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:55.885Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "ia4c131jrwyqkbyv9ctll15f": {
    "categoryId": "ia4c131jrwyqkbyv9ctll15f",
    "categorySlug": "plytkorizy",
    "categoryNameUk": "Плиткорізи",
    "categoryNameRu": "Плиткорезы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:55.958Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "k8at3q1x6dmrxy0ja04tqfod": {
    "categoryId": "k8at3q1x6dmrxy0ja04tqfod",
    "categorySlug": "pryladdya-do-plytkorizy",
    "categoryNameUk": "Приладдя до плиткорізи",
    "categoryNameRu": "Принадлежности к плиткорезы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:56.033Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "cdksnxqrvcltdoyyhjdg5q6i": {
    "categoryId": "cdksnxqrvcltdoyyhjdg5q6i",
    "categorySlug": "khrestyky-dlya-plytky",
    "categoryNameUk": "Хрестики для плитки",
    "categoryNameRu": "Хрестики для плитки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:56.105Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "k7wtdqe0q2upylyfrhmnttwl": {
    "categoryId": "k7wtdqe0q2upylyfrhmnttwl",
    "categorySlug": "plytky-hazovi",
    "categoryNameUk": "Плитки газові",
    "categoryNameRu": "Плитки газовые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:56.248Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "veps4mfmicaaqipit6aras9c": {
    "categoryId": "veps4mfmicaaqipit6aras9c",
    "categorySlug": "instrument-sadovyy-ruchnyy",
    "categoryNameUk": "Інструмент садовий ручний",
    "categoryNameRu": "Інструмент садовий ручний",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:56.322Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "qfpfnrtaf0itup2g1ope43or": {
    "categoryId": "qfpfnrtaf0itup2g1ope43or",
    "categorySlug": "trymery-dlya-trav",
    "categoryNameUk": "Тримери для трав",
    "categoryNameRu": "Тримери для трави",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:56.464Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "ci0xcsgkekpe60prmpj2otjd": {
    "categoryId": "ci0xcsgkekpe60prmpj2otjd",
    "categorySlug": "strubtsyny-stolyarni",
    "categoryNameUk": "Струбцини столярні",
    "categoryNameRu": "Струбцены столярные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:56.679Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "w9i5kpll63q87g8mzcd7jfk1": {
    "categoryId": "w9i5kpll63q87g8mzcd7jfk1",
    "categorySlug": "nadfili",
    "categoryNameUk": "Надфілі",
    "categoryNameRu": "Надфили",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:56.755Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "hx3da7573r39oz3x8quthisl": {
    "categoryId": "hx3da7573r39oz3x8quthisl",
    "categorySlug": "tertky-pinoplastovi",
    "categoryNameUk": "Тертки пінопластові",
    "categoryNameRu": "Терки пенопластовые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:56.829Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "q2glexrszm5conhhbhff0d2e": {
    "categoryId": "q2glexrszm5conhhbhff0d2e",
    "categorySlug": "sverdla-i-koronky-po-sklu-ta-plyttsi",
    "categoryNameUk": "Свердла і коронки по склу та плитці",
    "categoryNameRu": "Сверла и коронки по стеклу и плитке",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:56.972Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "um8zwdi6dn7q8dhprnt2z0h1": {
    "categoryId": "um8zwdi6dn7q8dhprnt2z0h1",
    "categorySlug": "sverdla-koronchati",
    "categoryNameUk": "Свердла корончаті",
    "categoryNameRu": "Сверла корончатые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:57.047Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "r3nnz4iwee1gk7x9e471hweq": {
    "categoryId": "r3nnz4iwee1gk7x9e471hweq",
    "categorySlug": "tsvyakhy-i-shpylky-dlya-pnevmatychnoho-steplera",
    "categoryNameUk": "Цвяхи і шпильки для пневматичного степлера",
    "categoryNameRu": "Гвозди и заколки для пневматического степлера",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:57.117Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "f3oxiiwpkymfvdh5v98cnbt6": {
    "categoryId": "f3oxiiwpkymfvdh5v98cnbt6",
    "categorySlug": "doshchovyky-dlya-polyvannya",
    "categoryNameUk": "Дощовики для поливання",
    "categoryNameRu": "Дождеватели для полива",
    "params": {
      "distBlock": 0,
      "floorShadowY": 0.85,
      "minHoleSize": 99999
    },
    "calibratedAt": "2026-06-02T19:01:57.193Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "w7cjvvfw0h5azp1rz7x1gmcn": {
    "categoryId": "w7cjvvfw0h5azp1rz7x1gmcn",
    "categorySlug": "konektory-dlya-shlanhiv",
    "categoryNameUk": "Конектори для шлангів",
    "categoryNameRu": "Конектори для шлангів",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:57.272Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "v927l4n1znai5k5b277f26ff": {
    "categoryId": "v927l4n1znai5k5b277f26ff",
    "categorySlug": "mufty-remontni-dlya-shlanhiv",
    "categoryNameUk": "Муфти ремонтні для шлангів",
    "categoryNameRu": "Муфти ремонтні для шлангів",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:57.345Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "ynpmanqdahxvywtpfrmx8hxk": {
    "categoryId": "ynpmanqdahxvywtpfrmx8hxk",
    "categorySlug": "shlanhy-dlya-polyvannya",
    "categoryNameUk": "Шланги для поливання",
    "categoryNameRu": "Шланги для поливу",
    "params": {
      "distBlock": 0,
      "floorShadowY": 0.85,
      "minHoleSize": 99999
    },
    "calibratedAt": "2026-06-02T19:01:57.418Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "rjk6zitzrqnudbls5a5k2tkb": {
    "categoryId": "rjk6zitzrqnudbls5a5k2tkb",
    "categorySlug": "sokyry",
    "categoryNameUk": "Сокири",
    "categoryNameRu": "Сокири",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:57.559Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "jm6gg87y1xks4onl5vkoe29a": {
    "categoryId": "jm6gg87y1xks4onl5vkoe29a",
    "categorySlug": "hrabli-viyalovi",
    "categoryNameUk": "Граблі віялові",
    "categoryNameRu": "Граблі віялові",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:57.632Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "pk391zq5p4tredktietagr2k": {
    "categoryId": "pk391zq5p4tredktietagr2k",
    "categorySlug": "hrabli-lopatky-sapy",
    "categoryNameUk": "Граблі, лопатки , сапи",
    "categoryNameRu": "Граблі, лопатки , сапи",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:57.708Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "jt1dj3p31ajeyu18ahucgv69": {
    "categoryId": "jt1dj3p31ajeyu18ahucgv69",
    "categorySlug": "nozhivky-sadovi",
    "categoryNameUk": "Ножівки садові",
    "categoryNameRu": "Ножівки садові",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:57.781Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "u54eiis2jcqb2sxtc3r28qn9": {
    "categoryId": "u54eiis2jcqb2sxtc3r28qn9",
    "categorySlug": "sekatory",
    "categoryNameUk": "Секатори",
    "categoryNameRu": "Секаторы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:57.862Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "r8axnncsymfdoiqik5ufigm1": {
    "categoryId": "r8axnncsymfdoiqik5ufigm1",
    "categorySlug": "sverdla-dlya-metalu",
    "categoryNameUk": "Свердла для металу",
    "categoryNameRu": "Сверла по металлу",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:57.934Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "hipu5w4kaxplsifm3jsbq1xv": {
    "categoryId": "hipu5w4kaxplsifm3jsbq1xv",
    "categorySlug": "hazonokosarky-elektrychni",
    "categoryNameUk": "Газонокосарки електричні",
    "categoryNameRu": "Газонокосарки електричні",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.009Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "zjzjo2b2zxvpl6wslqs9t4is": {
    "categoryId": "zjzjo2b2zxvpl6wslqs9t4is",
    "categorySlug": "motokosy-benzokosy",
    "categoryNameUk": "Мотокоси (бензокоси)",
    "categoryNameRu": "Мотокоси (бензокоси)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.082Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "or7kkb6vuulp9p3wwey9aggt": {
    "categoryId": "or7kkb6vuulp9p3wwey9aggt",
    "categorySlug": "trymery-elektrychni",
    "categoryNameUk": "Тримери електричні",
    "categoryNameRu": "Тримери електричні",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.155Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "fksg0axv69j32f468dgdv1j2": {
    "categoryId": "fksg0axv69j32f468dgdv1j2",
    "categorySlug": "2-0-1-0",
    "categoryNameUk": "2,0/1,0",
    "categoryNameRu": "2,0/1,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.297Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "ai42kuh9zq5env8675kwahi4": {
    "categoryId": "ai42kuh9zq5env8675kwahi4",
    "categorySlug": "hidroizolyatsiya-pid-plytku",
    "categoryNameUk": "Гідроізоляція під плитку",
    "categoryNameRu": "Гидроизоляция под плитку",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.369Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "htxqosat2anac6vbn89vs0cp": {
    "categoryId": "htxqosat2anac6vbn89vs0cp",
    "categorySlug": "hidroizolyatsiya-pidlohy",
    "categoryNameUk": "Гідроізоляція підлоги",
    "categoryNameRu": "Гидроизоляция пола",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.442Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "wqp5j7ykhpx5lkq0jtih3yzd": {
    "categoryId": "wqp5j7ykhpx5lkq0jtih3yzd",
    "categorySlug": "multyinstrumenty-multituly",
    "categoryNameUk": "Мультиінструменти (мультітули)",
    "categoryNameRu": "Мультиінструменти (мультітули)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.517Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "ltmd6gvuefv0kfb53375vxj3": {
    "categoryId": "ltmd6gvuefv0kfb53375vxj3",
    "categorySlug": "klyuchi-svichkovi",
    "categoryNameUk": "Ключі свічкові",
    "categoryNameRu": "Ключи свечные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.590Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "n6kzs2nhr8s1cfw0u5a6uyc5": {
    "categoryId": "n6kzs2nhr8s1cfw0u5a6uyc5",
    "categorySlug": "devaysy-do-stantsiy",
    "categoryNameUk": "Девайси до станцій",
    "categoryNameRu": "Девайсы к станциям",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.663Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "pilpye5cf7rihr6whurn38b9": {
    "categoryId": "pilpye5cf7rihr6whurn38b9",
    "categorySlug": "zaklepochnyky-pnevmatychni",
    "categoryNameUk": "Заклепочники пневматичні",
    "categoryNameRu": "Заклепочники пневматические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.734Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "odiqsjlkn6z554hstkdg83uz": {
    "categoryId": "odiqsjlkn6z554hstkdg83uz",
    "categorySlug": "drabyny",
    "categoryNameUk": "Драбини",
    "categoryNameRu": "Лестницы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.878Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "r8fcc99yjhkaa45ih47xryy9": {
    "categoryId": "r8fcc99yjhkaa45ih47xryy9",
    "categorySlug": "olivtsi-dlya-dereva-skla-i-plytky",
    "categoryNameUk": "Олівці для дерева, скла і плитки",
    "categoryNameRu": "Карандаши для дерева, стекла и плитки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:58.949Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "fp7qox1jgn99r589g3nl0vmj": {
    "categoryId": "fp7qox1jgn99r589g3nl0vmj",
    "categorySlug": "markery-rozmichuvalni",
    "categoryNameUk": "Маркери розмічувальні",
    "categoryNameRu": "Маркеры разметочные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:59.018Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "qatmyo5ho38mxtwvk7p8j4fi": {
    "categoryId": "qatmyo5ho38mxtwvk7p8j4fi",
    "categorySlug": "mel-trasuvalni",
    "categoryNameUk": "Мел трасувальні",
    "categoryNameRu": "Мел трассирующие",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:59.088Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "aja5gh5h1y8xop58thvpc6nh": {
    "categoryId": "aja5gh5h1y8xop58thvpc6nh",
    "categorySlug": "vysky",
    "categoryNameUk": "Виски",
    "categoryNameRu": "Виски",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:59.158Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "ixdwjks26d5x8duz7ximbkcl": {
    "categoryId": "ixdwjks26d5x8duz7ximbkcl",
    "categorySlug": "kelmy-kovshi",
    "categoryNameUk": "Кельми, ковші",
    "categoryNameRu": "Кельмы, ковши",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:59.230Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "t2hwpqv7qcjzk5thpzdi0g3d": {
    "categoryId": "t2hwpqv7qcjzk5thpzdi0g3d",
    "categorySlug": "budivelni-yemnosti",
    "categoryNameUk": "Будівельні ємності",
    "categoryNameRu": "Строительные емкости",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:59.300Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "yph909b451qf8ikjamru9ky9": {
    "categoryId": "yph909b451qf8ikjamru9ky9",
    "categorySlug": "pistolety-rozpylyuvachi-dlya-polyvu",
    "categoryNameUk": "Пістолети-розпилювачі для поливу",
    "categoryNameRu": "Пистолеты-распылители для полива",
    "params": {
      "distBlock": 0,
      "floorShadowY": 0.85,
      "minHoleSize": 99999
    },
    "calibratedAt": "2026-06-02T19:01:59.407Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "nzu2uys47rip655tnwj13rpi": {
    "categoryId": "nzu2uys47rip655tnwj13rpi",
    "categorySlug": "taymery-dlya-podachi-vody",
    "categoryNameUk": "Таймери для подачі води",
    "categoryNameRu": "Таймеры для подачи воды",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:59.479Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "xf94cf1xkve6u55n3w7l8ky1": {
    "categoryId": "xf94cf1xkve6u55n3w7l8ky1",
    "categorySlug": "kotushky-dlya-shlanhiv",
    "categoryNameUk": "Котушки для шлангів",
    "categoryNameRu": "Катушки для шлангов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:59.553Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "akbuhk6eo4ktlveo7x0vv20q": {
    "categoryId": "akbuhk6eo4ktlveo7x0vv20q",
    "categorySlug": "shlanhy-dlya-vody",
    "categoryNameUk": "Шланги для води",
    "categoryNameRu": "Шланги для води",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:59.627Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "nb27dmz1g4t6ipsbv305zsmn": {
    "categoryId": "nb27dmz1g4t6ipsbv305zsmn",
    "categorySlug": "stamesky",
    "categoryNameUk": "Стамески",
    "categoryNameRu": "Стамески",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:59.701Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "qwwuggou87od8ubdd9qgqwbs": {
    "categoryId": "qwwuggou87od8ubdd9qgqwbs",
    "categorySlug": "rubanky",
    "categoryNameUk": "Рубанки",
    "categoryNameRu": "Рубанки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:59.770Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "dj0sipre0ofbxcotknt3osyx": {
    "categoryId": "dj0sipre0ofbxcotknt3osyx",
    "categorySlug": "napylky",
    "categoryNameUk": "Напилки",
    "categoryNameRu": "Напильники",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:01:59.912Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "d9r561ut9fieyg8bafwf3unq": {
    "categoryId": "d9r561ut9fieyg8bafwf3unq",
    "categorySlug": "nozhytsi",
    "categoryNameUk": "Ножиці",
    "categoryNameRu": "Ножницы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:00.052Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "ex4kw8m7ysr1egnefnf6gjgt": {
    "categoryId": "ex4kw8m7ysr1egnefnf6gjgt",
    "categorySlug": "terky-dlya-volframovoyi-sitky",
    "categoryNameUk": "Терки для вольфрамової сітки",
    "categoryNameRu": "Терки для вольфрамової сітки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:00.121Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "xqpi3kq1wbanj59cyayxxd4m": {
    "categoryId": "xqpi3kq1wbanj59cyayxxd4m",
    "categorySlug": "shpateli-humovi",
    "categoryNameUk": "Шпателі гумові",
    "categoryNameRu": "Шпатели резиновые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:00.193Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "sschwlraacowmw7zari4j10r": {
    "categoryId": "sschwlraacowmw7zari4j10r",
    "categorySlug": "zaklepky-alyuminiyevi-stalevi",
    "categoryNameUk": "Заклепки алюмінієві, сталеві",
    "categoryNameRu": "Заклепки алюминиевые, стальные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:00.267Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "h4s0ijex1oath0lnchhwlsuk": {
    "categoryId": "h4s0ijex1oath0lnchhwlsuk",
    "categorySlug": "zubyla-i-prosechky",
    "categoryNameUk": "Зубила і просечки",
    "categoryNameRu": "Зубила и просечки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:00.478Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "cwy2ag7lta18kvqwajrs3603": {
    "categoryId": "cwy2ag7lta18kvqwajrs3603",
    "categorySlug": "kyyanky",
    "categoryNameUk": "Киянки",
    "categoryNameRu": "Киянки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:00.551Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "vja3l200k3gxx7d2zcsoiuql": {
    "categoryId": "vja3l200k3gxx7d2zcsoiuql",
    "categorySlug": "chokhly-dlya-instrumentiv",
    "categoryNameUk": "Чохли для інструментів",
    "categoryNameRu": "Чехлы для инструментов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:00.620Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "owaceo9ixremyhjxpaqymt3a": {
    "categoryId": "owaceo9ixremyhjxpaqymt3a",
    "categorySlug": "okulyary-ta-zakhysni-masky",
    "categoryNameUk": "Окуляри та захисні маски",
    "categoryNameRu": "Окуляри та захисні маски",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:00.691Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mlp8ku3o300lsigvj7o6x1f3": {
    "categoryId": "mlp8ku3o300lsigvj7o6x1f3",
    "categorySlug": "respiratory",
    "categoryNameUk": "Респіратори",
    "categoryNameRu": "Респіратори",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:00.761Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "s48wx4pop2lmco8gonirvb0s": {
    "categoryId": "s48wx4pop2lmco8gonirvb0s",
    "categorySlug": "navushnyky-shumoizolyatsiyni",
    "categoryNameUk": "Навушники шумоізоляційні",
    "categoryNameRu": "Навушники шумоізоляційні",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:00.835Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "p6n0xe4ukyxvpgtwkbv9fbnb": {
    "categoryId": "p6n0xe4ukyxvpgtwkbv9fbnb",
    "categorySlug": "koronky-dlya-metalu",
    "categoryNameUk": "Коронки для металу",
    "categoryNameRu": "Коронки по металу",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:00.906Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mjkfd0m4ekd88rrs5hkrs8ga": {
    "categoryId": "mjkfd0m4ekd88rrs5hkrs8ga",
    "categorySlug": "sverdla-koronchati-po-betonu",
    "categoryNameUk": "Свердла корончаті по бетону",
    "categoryNameRu": "Сверла корончатые по бетону",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.051Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "pc02hm0atpdhbka9xl4cu70d": {
    "categoryId": "pc02hm0atpdhbka9xl4cu70d",
    "categorySlug": "nabory-sverdel-po-metalu",
    "categoryNameUk": "Набори свердел по металу",
    "categoryNameRu": "Наборы сверел по металу",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.121Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "ys6bb3izy07a89fd7mt7axck": {
    "categoryId": "ys6bb3izy07a89fd7mt7axck",
    "categorySlug": "ruchky-dlya-valykiv",
    "categoryNameUk": "Ручки для валиків",
    "categoryNameRu": "Ручки для валиков",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.192Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "aru7xjs5kplgn3433yo44css": {
    "categoryId": "aru7xjs5kplgn3433yo44css",
    "categorySlug": "futbolky-zhakety",
    "categoryNameUk": "Футболки жакети",
    "categoryNameRu": "Футболки жакеты",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.261Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "lbp1g02uq07t3n9xpj7h9gz3": {
    "categoryId": "lbp1g02uq07t3n9xpj7h9gz3",
    "categorySlug": "miksery",
    "categoryNameUk": "Міксери",
    "categoryNameRu": "Миксеры",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.332Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "spk0us8o46z4b1dgtolfrffg": {
    "categoryId": "spk0us8o46z4b1dgtolfrffg",
    "categorySlug": "patrony-dlya-dryliv",
    "categoryNameUk": "Патрони для дрилів",
    "categoryNameRu": "Патроны для дрелей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.404Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "t5cjwlj3pqbswsh0jgze8e1q": {
    "categoryId": "t5cjwlj3pqbswsh0jgze8e1q",
    "categorySlug": "termorehulyatory",
    "categoryNameUk": "Терморегулятори",
    "categoryNameRu": "Терморегуляторы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.552Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ohiadmpe50zi5nkd3br0lhkn": {
    "categoryId": "ohiadmpe50zi5nkd3br0lhkn",
    "categorySlug": "tepla-pidloha",
    "categoryNameUk": "Тепла підлога",
    "categoryNameRu": "Теплый пол",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.627Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ykyq6plr6pe0dfojtzuccbfi": {
    "categoryId": "ykyq6plr6pe0dfojtzuccbfi",
    "categorySlug": "portatyvni-zaryadni-stantsiyi",
    "categoryNameUk": "Портативні зарядні станції",
    "categoryNameRu": "Портативные зарядные станции",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.774Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "if5w37ercp7bmkihymqs9jym": {
    "categoryId": "if5w37ercp7bmkihymqs9jym",
    "categorySlug": "akumulyatorni-batareyi",
    "categoryNameUk": "Акумуляторні батареї",
    "categoryNameRu": "Аккумуляторные батареи",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.852Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "pcjlcog8epd9nlh8u90w5nyq": {
    "categoryId": "pcjlcog8epd9nlh8u90w5nyq",
    "categorySlug": "tsvyakhy-dlya-mekhanichnoho-steplera",
    "categoryNameUk": "Цвяхи для механічного степлера",
    "categoryNameRu": "Гвозди для механического степлера",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.922Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "ejac2tvnonla4nqxvn7f5wqv": {
    "categoryId": "ejac2tvnonla4nqxvn7f5wqv",
    "categorySlug": "skoby-dlya-mekhanichnoho-steplera",
    "categoryNameUk": "Скоби для механічного степлера",
    "categoryNameRu": "Скобы для механического степлера",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:01.993Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "amjyuuco7a1693bm16eo3p37": {
    "categoryId": "amjyuuco7a1693bm16eo3p37",
    "categorySlug": "boyok-do-pnevmosteplera",
    "categoryNameUk": "Бойок до пневмостеплера",
    "categoryNameRu": "Бойок до пневмостеплера",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:02.077Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "tddq7h6fprjypg8qa5cgn423": {
    "categoryId": "tddq7h6fprjypg8qa5cgn423",
    "categorySlug": "klyuchi-torx-h-obrazni",
    "categoryNameUk": "Ключі TORX Г- образні",
    "categoryNameRu": "Ключи TORX Г-образные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:02.216Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "gtm7rbiau8kfm9krsjatp9w5": {
    "categoryId": "gtm7rbiau8kfm9krsjatp9w5",
    "categorySlug": "lebidky-vazhilni",
    "categoryNameUk": "Лебідки важільні",
    "categoryNameRu": "Лебедки рычажные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:02.289Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "gsh5v8oldqi6sv0w94zuc1mm": {
    "categoryId": "gsh5v8oldqi6sv0w94zuc1mm",
    "categorySlug": "nabory-sverdel-dlya-dereva",
    "categoryNameUk": "Набори свердел для дерева",
    "categoryNameRu": "Наборы сверел по дереву",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:02.359Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "qjr932yk60j5r7wlscb0dlg6": {
    "categoryId": "qjr932yk60j5r7wlscb0dlg6",
    "categorySlug": "sverdla-ta-koronky-dlya-dereva",
    "categoryNameUk": "Свердла та коронки для дерева",
    "categoryNameRu": "Сверла и коронки по дереву",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:02.430Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "n794mvft0rml8uauwtq6ikeu": {
    "categoryId": "n794mvft0rml8uauwtq6ikeu",
    "categorySlug": "sverdla-po-derevu-pir-yani",
    "categoryNameUk": "Свердла по дереву пір'яні",
    "categoryNameRu": "Сверла по дереву перьевые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:02.501Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "r0pcbru7zt58xerm68rkpklh": {
    "categoryId": "r0pcbru7zt58xerm68rkpklh",
    "categorySlug": "sverdla-po-derevu-spiralni",
    "categoryNameUk": "Свердла по дереву спіральні",
    "categoryNameRu": "Сверла по дереву спиральные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:02.573Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "z2qc19pkte7fda3vp5bp9rvm": {
    "categoryId": "z2qc19pkte7fda3vp5bp9rvm",
    "categorySlug": "bury-sds-max-dlya-perforatoriv",
    "categoryNameUk": "Бури SDS - Max для перфораторів",
    "categoryNameRu": "Буры SDS-Max для перфораторов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:02.812Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "aj9ylkrseoh02fcu9k1zrc1v": {
    "categoryId": "aj9ylkrseoh02fcu9k1zrc1v",
    "categorySlug": "bury-sds-plus-dlya-perforatoriv",
    "categoryNameUk": "Бури SDS -Plus для перфораторів",
    "categoryNameRu": "Буры SDS-Plus для перфораторов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:02.893Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ncerl7khrtb44gwj7bs8wmka": {
    "categoryId": "ncerl7khrtb44gwj7bs8wmka",
    "categorySlug": "zubyla-sds-plus-i-sds-max",
    "categoryNameUk": "Зубила SDS -Plus і SDS - Max",
    "categoryNameRu": "Зубила SDS-Plus и SDS - Max",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:02.966Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "trlz4usgl0cf0866j5p3g6wn": {
    "categoryId": "trlz4usgl0cf0866j5p3g6wn",
    "categorySlug": "probiynyky-po-kamenyu",
    "categoryNameUk": "Пробійники по каменю",
    "categoryNameRu": "Пробойники по камню",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.037Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "ym2o7m8pqoptz4zo4e4xwlur": {
    "categoryId": "ym2o7m8pqoptz4zo4e4xwlur",
    "categorySlug": "khomuty-metalevi",
    "categoryNameUk": "Хомути металеві",
    "categoryNameRu": "Хомуты металлические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.120Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mwqhl4zx0v7n0i48628errmg": {
    "categoryId": "mwqhl4zx0v7n0i48628errmg",
    "categorySlug": "e27",
    "categoryNameUk": "E27",
    "categoryNameRu": "E27",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.195Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "k98f60pybgwymcn6762x7lb2": {
    "categoryId": "k98f60pybgwymcn6762x7lb2",
    "categorySlug": "e14",
    "categoryNameUk": "E14",
    "categoryNameRu": "E14",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.268Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "gn694foasjma80s5w9s6mt66": {
    "categoryId": "gn694foasjma80s5w9s6mt66",
    "categorySlug": "g4-g9",
    "categoryNameUk": "G4-G9",
    "categoryNameRu": "G4-G9",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.345Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "gkzdiqjacea3cvbng1nq3r4h": {
    "categoryId": "gkzdiqjacea3cvbng1nq3r4h",
    "categorySlug": "strichka",
    "categoryNameUk": "Стрічка",
    "categoryNameRu": "Лента",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.423Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "cou3ymi071g4eshzg0ftt9a2": {
    "categoryId": "cou3ymi071g4eshzg0ftt9a2",
    "categorySlug": "moduli",
    "categoryNameUk": "Модулі",
    "categoryNameRu": "Модули",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.498Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "of7ybj1s62avn50lnk7163ap": {
    "categoryId": "of7ybj1s62avn50lnk7163ap",
    "categorySlug": "liniyky",
    "categoryNameUk": "Лінійки",
    "categoryNameRu": "Линейки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.647Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "n8gqcw73qjs9s3ie5grsqdzm": {
    "categoryId": "n8gqcw73qjs9s3ie5grsqdzm",
    "categorySlug": "g13",
    "categoryNameUk": "G13",
    "categoryNameRu": "G13",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.718Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "fvlmkn1fsbtn9lngqqrlyflu": {
    "categoryId": "fvlmkn1fsbtn9lngqqrlyflu",
    "categorySlug": "zaryadni-prystroyi-do-shurupokrutiv",
    "categoryNameUk": "Зарядні пристрої до шурупокрутів",
    "categoryNameRu": "Зарядные устройства к шуруповертам",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.787Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "skbnymtzra1wh7ck6w0m15k2": {
    "categoryId": "skbnymtzra1wh7ck6w0m15k2",
    "categorySlug": "sverdla-konfirmatni",
    "categoryNameUk": "Свердла конфірматні",
    "categoryNameRu": "Свердла конфірматні",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.862Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "kmi5vgzisk73ngnu4efo12fa": {
    "categoryId": "kmi5vgzisk73ngnu4efo12fa",
    "categorySlug": "svitylnyky",
    "categoryNameUk": "Світильники",
    "categoryNameRu": "Светильники",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:03.943Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "dvylbrcbwqr8kimhqz733p0i": {
    "categoryId": "dvylbrcbwqr8kimhqz733p0i",
    "categorySlug": "vorotky",
    "categoryNameUk": "Воротки",
    "categoryNameRu": "Воротки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:04.016Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "xqqwo653e6986jaokjohfgsr": {
    "categoryId": "xqqwo653e6986jaokjohfgsr",
    "categorySlug": "klyuchi-dlya-zatysku-kontrhayky-dlya-ushm",
    "categoryNameUk": "Ключі для затиску контргайки для УШМ",
    "categoryNameRu": "Ключі для затиску контргайки для УШМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:04.087Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "iw357q5ne3e42ix2df6unox3": {
    "categoryId": "iw357q5ne3e42ix2df6unox3",
    "categorySlug": "kontrhayky-prytyskni-dlya-ushm",
    "categoryNameUk": "Контргайки притискні для УШМ",
    "categoryNameRu": "Контргайки притискні для УШМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:04.160Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "a13156xvm183fefw43vz56qt": {
    "categoryId": "a13156xvm183fefw43vz56qt",
    "categorySlug": "fotomoduli-sonyachni-batareyi",
    "categoryNameUk": "Фотомодулі сонячні батареї",
    "categoryNameRu": "Фотомодули солнечные батареи",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:04.238Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "uvhdnnajztta0ehh1wr92f0f": {
    "categoryId": "uvhdnnajztta0ehh1wr92f0f",
    "categorySlug": "mobilni-sonyachni-zaryadky",
    "categoryNameUk": "Мобільні сонячні зарядки",
    "categoryNameRu": "Мобильные солнечные зарядки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:04.312Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "k2jwkyy6wppfbqvkeopa7p3n": {
    "categoryId": "k2jwkyy6wppfbqvkeopa7p3n",
    "categorySlug": "klemni-zatyskachi-kintsevi-odynarni-seriyi-t",
    "categoryNameUk": "Клемні затискачі кінцеві одинарні серії Т",
    "categoryNameRu": "Клемні затискачі кінцеві одинарні серії Т",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:04.526Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "o82n2umpfsqtxk4ngcvs47cz": {
    "categoryId": "o82n2umpfsqtxk4ngcvs47cz",
    "categorySlug": "klemni-zatyskachi-kintsevi-seriyi-5kh1",
    "categoryNameUk": "Клемні затискачі кінцеві серії 5х1",
    "categoryNameRu": "Клемні затискачі кінцеві серії 5х1",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:04.597Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "zs0068misjcuyp0m7jv67cbv": {
    "categoryId": "zs0068misjcuyp0m7jv67cbv",
    "categorySlug": "heneratory",
    "categoryNameUk": "Генератори",
    "categoryNameRu": "Генераторы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:04.671Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "vlqz7ny280keoa263amku7hz": {
    "categoryId": "vlqz7ny280keoa263amku7hz",
    "categorySlug": "superkley",
    "categoryNameUk": "Суперклей",
    "categoryNameRu": "Супер клей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:04.818Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "d3se049dsz3vin9fjn7w3sjm": {
    "categoryId": "d3se049dsz3vin9fjn7w3sjm",
    "categorySlug": "rivni-budivelni-1",
    "categoryNameUk": "Рівні будівельні",
    "categoryNameRu": "Уровни строительные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:05.173Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "hp3741cmg14bkhdpjhljh1c9": {
    "categoryId": "hp3741cmg14bkhdpjhljh1c9",
    "categorySlug": "rele-chasu-seriyi-nte9",
    "categoryNameUk": "Реле часу серії NTE9",
    "categoryNameRu": "Реле часу серії NTE9",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:05.249Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "s2yvk9pr1i85mkpb12c2xlz8": {
    "categoryId": "s2yvk9pr1i85mkpb12c2xlz8",
    "categorySlug": "modulni-rele-kontrolyu-napruhy-seriyi-rkv",
    "categoryNameUk": "Модульні реле контролю напруги серії RKV",
    "categoryNameRu": "Модульні реле контролю напруги серії RKV",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:05.324Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "mwqybivtqrku3gzixea63ab6": {
    "categoryId": "mwqybivtqrku3gzixea63ab6",
    "categorySlug": "nakonechnyky-midni-seriyi-dt-fn",
    "categoryNameUk": "Наконечники мідні серії DT(FN)",
    "categoryNameRu": "Наконечники медные серии DT(FN)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:05.403Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "ay7g3o2iwwi9t21lzfnawowj": {
    "categoryId": "ay7g3o2iwwi9t21lzfnawowj",
    "categorySlug": "aksesuary-do-klem-rst-ta-ass",
    "categoryNameUk": "Аксесуари до клем РСТ та АСС",
    "categoryNameRu": "Аксесуари до клем РСТ та АСС",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:05.473Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "ytfywvx8awkr3shnleu3p8xp": {
    "categoryId": "ytfywvx8awkr3shnleu3p8xp",
    "categorySlug": "kriplennya-dlya-plastykovykh-trub",
    "categoryNameUk": "Кріплення для пластикових труб",
    "categoryNameRu": "Крепления для пластиковых труб",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:05.547Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "lnu560tzc9bcaz7bdyb9onoy": {
    "categoryId": "lnu560tzc9bcaz7bdyb9onoy",
    "categorySlug": "din-reyka-alyuminiyeva",
    "categoryNameUk": "Din-рейка алюмінієва",
    "categoryNameRu": "Din-рейка алюмінієва",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:05.619Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "hpxyjbiwlictvknn1x81w08s": {
    "categoryId": "hpxyjbiwlictvknn1x81w08s",
    "categorySlug": "hilzy-termousadzhuvalni-seriyi-th",
    "categoryNameUk": "Гільзи термоусаджувальні серії ТГ",
    "categoryNameRu": "Гільзи термоусаджувальні серії ТГ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:05.694Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "mm1rzth2jgr13lbc2o7jzw1s": {
    "categoryId": "mm1rzth2jgr13lbc2o7jzw1s",
    "categorySlug": "termousadkovi-trubky-seriyi-pro",
    "categoryNameUk": "Термоусадкові трубки серії PRO",
    "categoryNameRu": "Термоусадочные трубки серии PRO",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:05.842Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "af88nhwb5gi31y0313qfzmgd": {
    "categoryId": "af88nhwb5gi31y0313qfzmgd",
    "categorySlug": "nabory-termousadzhuvalnoyi-trubky-seriyi-pro",
    "categoryNameUk": "Набори термоусаджувальної трубки серії PRO",
    "categoryNameRu": "Наборы термоусадочной трубки серии PRO",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:05.931Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "wlmsdrmjpcimfcni5ue967ld": {
    "categoryId": "wlmsdrmjpcimfcni5ue967ld",
    "categorySlug": "kolodky-seriyi-em-typ-w-u",
    "categoryNameUk": "Колодки серії ЕМ тип W (U)",
    "categoryNameRu": "Колодки серии ЭМ тип W(U)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:06.001Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "svrt5shcjdtpfms6ktoaj58a": {
    "categoryId": "svrt5shcjdtpfms6ktoaj58a",
    "categorySlug": "kolodky-seriyi-em-typ-n",
    "categoryNameUk": "Колодки серії ЕМ тип Н",
    "categoryNameRu": "Колодки серии ЭМ тип Н",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:06.076Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "aw9t4gvaq7hbhe0s09p1jgct": {
    "categoryId": "aw9t4gvaq7hbhe0s09p1jgct",
    "categorySlug": "lebidky-elektrychni-telfery",
    "categoryNameUk": "Лебідки електричні (тельфери)",
    "categoryNameRu": "Лебедки электрические (тельферы)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:06.155Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "qqtm9nfxjb7t3z51c9o7s556": {
    "categoryId": "qqtm9nfxjb7t3z51c9o7s556",
    "categorySlug": "intertool",
    "categoryNameUk": "INTERTOOL",
    "categoryNameRu": "INTERTOOL",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:06.230Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "uqewkca76hvyyhm5mmj272oi": {
    "categoryId": "uqewkca76hvyyhm5mmj272oi",
    "categorySlug": "korpusy-z-montazhnoyu-panellyu-seriyi-ubox",
    "categoryNameUk": "Корпуси з монтажною панеллю серії UBox",
    "categoryNameRu": "Корпуса с монтажной панелью серии UBox",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:06.594Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "p270ofv4qez2n7cpeud80y67": {
    "categoryId": "p270ofv4qez2n7cpeud80y67",
    "categorySlug": "neprozori-dvertsyata",
    "categoryNameUk": "Непрозорі дверцята",
    "categoryNameRu": "Непрозрачная дверца",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:06.738Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "ylgz9vzdqil9ucl845gu5kel": {
    "categoryId": "ylgz9vzdqil9ucl845gu5kel",
    "categorySlug": "prozori-dvertsyata",
    "categoryNameUk": "Прозорі дверцята",
    "categoryNameRu": "Прозрачная дверца",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:06.808Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "n1jjrodv3hp5jems85bputgr": {
    "categoryId": "n1jjrodv3hp5jems85bputgr",
    "categorySlug": "aksesuary-do-korpusiv",
    "categoryNameUk": "Аксесуари до корпусів",
    "categoryNameRu": "Аксессуары к корпусам",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:06.885Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "cja8x49yj18mta9t1axmc8xa": {
    "categoryId": "cja8x49yj18mta9t1axmc8xa",
    "categorySlug": "modulni-vymiryuvalni-prystroyi",
    "categoryNameUk": "Модульні вимірювальні пристрої",
    "categoryNameRu": "Модульні вимірювальні пристрої",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:06.954Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "xqhoaz8o2jr7vswhh3tmweu6": {
    "categoryId": "xqhoaz8o2jr7vswhh3tmweu6",
    "categorySlug": "klemy-z-yednuvalni-universalni-seriyi-smk-63kh",
    "categoryNameUk": "Клеми з’єднувальні універсальні серії СМК-63Х",
    "categoryNameRu": "Клеми з’єднувальні універсальні серії СМК-63Х",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:07.107Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "dkpbtumw2x5oz4fdiwgmizh4": {
    "categoryId": "dkpbtumw2x5oz4fdiwgmizh4",
    "categorySlug": "dyubel-khomuty-dlya-kabeliv",
    "categoryNameUk": "Дюбель-хомути для кабелів",
    "categoryNameRu": "Дюбель-хомути для кабелів",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:07.459Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "ap9v1vxo2811tlxmkqzsuhy5": {
    "categoryId": "ap9v1vxo2811tlxmkqzsuhy5",
    "categorySlug": "dyubeli-stn-3kh",
    "categoryNameUk": "Дюбелі СТН-3х",
    "categoryNameRu": "Дюбелі СТН-3х",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:07.680Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "lpzaterfuo2y8tf4vy5l5xee": {
    "categoryId": "lpzaterfuo2y8tf4vy5l5xee",
    "categorySlug": "bili",
    "categoryNameUk": "Білі",
    "categoryNameRu": "Білі",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:07.754Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "yc7zph92fesa6ck6tu9iwyz1": {
    "categoryId": "yc7zph92fesa6ck6tu9iwyz1",
    "categorySlug": "korpusa-metalevi-light-seriyi-ubox",
    "categoryNameUk": "Корпуса металеві Light серії UBox",
    "categoryNameRu": "Корпуса металеві Light серії UBox",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:07.902Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "v8pjvmxuc48mfze7zskm6w8h": {
    "categoryId": "v8pjvmxuc48mfze7zskm6w8h",
    "categorySlug": "vbudovani-1",
    "categoryNameUk": "Вбудовані",
    "categoryNameRu": "Вбудовані",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:08.327Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "dj4ituuptg93cxypwl3ect5r": {
    "categoryId": "dj4ituuptg93cxypwl3ect5r",
    "categorySlug": "vbudovani-shchytky-z-vikontsem-obliku-montazhni",
    "categoryNameUk": "Вбудовані щитки з віконцем обліку монтажні",
    "categoryNameRu": "Встроенные щитки с окошком учетом монтажные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:08.614Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "g0f2neyaypu8135y99unz0zw": {
    "categoryId": "g0f2neyaypu8135y99unz0zw",
    "categorySlug": "navisni-shchytky-z-vikontsem-oblikom-montazhni",
    "categoryNameUk": "Навісні щитки з віконцем обліком монтажні",
    "categoryNameRu": "Навесные щитки с окошком учетом монтажные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:08.685Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "eet8j91w3v3rmq194k146sdh": {
    "categoryId": "eet8j91w3v3rmq194k146sdh",
    "categorySlug": "vbudovani-light-1",
    "categoryNameUk": "Вбудовані Light",
    "categoryNameRu": "Вбудовані Light",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:08.967Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "akub7bsugq3wop1l9s4khx4b": {
    "categoryId": "akub7bsugq3wop1l9s4khx4b",
    "categorySlug": "ip31-1",
    "categoryNameUk": "IP31",
    "categoryNameRu": "IP31",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.111Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "hpjf1vvvnqe8w8xnba2qvfnv": {
    "categoryId": "hpjf1vvvnqe8w8xnba2qvfnv",
    "categorySlug": "ir31-light-1",
    "categoryNameUk": "ІР31 Light",
    "categoryNameRu": "ІР31 Light",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.184Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "awbf2j2vjqjj2kk3hkn767o7": {
    "categoryId": "awbf2j2vjqjj2kk3hkn767o7",
    "categorySlug": "ir54-light-1",
    "categoryNameUk": "ІР54 Light",
    "categoryNameRu": "ІР54 Light",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.262Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "kagmb23c8hnyzrniqpy6k5hv": {
    "categoryId": "kagmb23c8hnyzrniqpy6k5hv",
    "categorySlug": "kintsevi-kontaktni-elektrody-rhino",
    "categoryNameUk": "Кінцеві контактні електроди RHINO",
    "categoryNameRu": "Концевые контактные электроды RHINO",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.332Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "atmbr1j50e2gye7dejovrz9g": {
    "categoryId": "atmbr1j50e2gye7dejovrz9g",
    "categorySlug": "chorni-1",
    "categoryNameUk": "Чорні",
    "categoryNameRu": "Чорні",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.479Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "w3fr4gj5zi0oeq6d4yi0lzhz": {
    "categoryId": "w3fr4gj5zi0oeq6d4yi0lzhz",
    "categorySlug": "avariynyy-kontakt",
    "categoryNameUk": "Аварійний контакт",
    "categoryNameRu": "Аварийный контакт",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.549Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "c0b029a8qbxevhaa1jej4tje": {
    "categoryId": "c0b029a8qbxevhaa1jej4tje",
    "categorySlug": "dodatkovyy-kontakt",
    "categoryNameUk": "Додатковий контакт",
    "categoryNameRu": "Дополнительный контакт",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.621Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "jx1xm3jbxmumh8mflnsikum8": {
    "categoryId": "jx1xm3jbxmumh8mflnsikum8",
    "categorySlug": "dodatkovyy-ta-avariynyy-kontakt",
    "categoryNameUk": "Додатковий та аварійний контакт",
    "categoryNameRu": "Дополнительный и аварийный контакт",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.692Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "iyw5loa3jbpwmbufozswm2h7": {
    "categoryId": "iyw5loa3jbpwmbufozswm2h7",
    "categorySlug": "nezalezhnyy-rozchiplyuvach",
    "categoryNameUk": "Незалежний розчіплювач",
    "categoryNameRu": "Независимый расцепитель",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.766Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "xg7dnb9iy3oul2xj55lqaoqx": {
    "categoryId": "xg7dnb9iy3oul2xj55lqaoqx",
    "categorySlug": "elektropryvid-peremykannya",
    "categoryNameUk": "Електропривід перемикання",
    "categoryNameRu": "Электропривод переключения",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.838Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "kl68yao5y37ulkvn8f5jn8g2": {
    "categoryId": "kl68yao5y37ulkvn8f5jn8g2",
    "categorySlug": "ruchnyy-pryvid-peremykannya",
    "categoryNameUk": "Ручний привід перемикання",
    "categoryNameRu": "Ручной привод переключения",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.907Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "pfdc723ekn0nmp95yzgodvc6": {
    "categoryId": "pfdc723ekn0nmp95yzgodvc6",
    "categorySlug": "mizhfazni-perehorodky",
    "categoryNameUk": "Міжфазні перегородки",
    "categoryNameRu": "Межфазные перегородки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:09.980Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "xotv7d2hv33thxrhv8vejocr": {
    "categoryId": "xotv7d2hv33thxrhv8vejocr",
    "categorySlug": "avtoinstrument",
    "categoryNameUk": "Автоінструмент",
    "categoryNameRu": "Автоинструмент",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:10.053Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "lsx3um9oct4qrfm8tg9kcraj": {
    "categoryId": "lsx3um9oct4qrfm8tg9kcraj",
    "categorySlug": "znimachi-i-obzhymky-1",
    "categoryNameUk": "Знімачі і обжимки",
    "categoryNameRu": "Стяжки и сьемники",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:10.125Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "ermbg9xs1366q44hdewv05by": {
    "categoryId": "ermbg9xs1366q44hdewv05by",
    "categorySlug": "adaptery-ta-triynyky",
    "categoryNameUk": "Адаптери та трійники",
    "categoryNameRu": "Адаптеры и тройники",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:10.267Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "edlqsgd7czkuhv2hwsasui7a": {
    "categoryId": "edlqsgd7czkuhv2hwsasui7a",
    "categorySlug": "holovky-tortsevi-shestyhranni",
    "categoryNameUk": "Головки торцеві шестигранні",
    "categoryNameRu": "Головки торцевые шестигранные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:10.344Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "t01q84ws8avs8ium3tggsrks": {
    "categoryId": "t01q84ws8avs8ium3tggsrks",
    "categorySlug": "klyuchi-haykovi-kombinovani",
    "categoryNameUk": "Ключі гайкові комбіновані",
    "categoryNameRu": "Ключи гаечные комбинированные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:10.426Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "zwjpiinvlr0xrmo06usuytl1": {
    "categoryId": "zwjpiinvlr0xrmo06usuytl1",
    "categorySlug": "pyly-tsipni",
    "categoryNameUk": "Пили ціпні",
    "categoryNameRu": "Пили цепные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:10.500Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "vg18j7bjjacmi9tkuxzrcggq": {
    "categoryId": "vg18j7bjjacmi9tkuxzrcggq",
    "categorySlug": "zvaryuvalna-provoloka-procraft",
    "categoryNameUk": "Зварювальна проволока Procraft",
    "categoryNameRu": "Сварочная проволока Procraft",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:10.648Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "ekt7pf1wz5g9hvr00q5bbwqm": {
    "categoryId": "ekt7pf1wz5g9hvr00q5bbwqm",
    "categorySlug": "rozetka-c45",
    "categoryNameUk": "Розетка C45",
    "categoryNameRu": "Розетка C45",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:10.720Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "mff2qmtxhmbbjglqfv3qzjzh": {
    "categoryId": "mff2qmtxhmbbjglqfv3qzjzh",
    "categorySlug": "korobky-ustanovchi-seriyi-km",
    "categoryNameUk": "Коробки установчі серії КМ",
    "categoryNameRu": "Коробки установчі серії КМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:10.804Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "tfrx2pztfn9u5k9tagf6iqzg": {
    "categoryId": "tfrx2pztfn9u5k9tagf6iqzg",
    "categorySlug": "pyly-lantsyuhovi-merezhevi",
    "categoryNameUk": "Пили ланцюгові мережеві",
    "categoryNameRu": "Пилы цепные сетевые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:10.877Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "hprmnoloxvo00vk89rlmjc98": {
    "categoryId": "hprmnoloxvo00vk89rlmjc98",
    "categorySlug": "pistolety-produvni-pnevmatychni",
    "categoryNameUk": "Пістолети продувні пневматичні",
    "categoryNameRu": "Пистолеты продувочные пневматические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:10.963Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "bwz5i4eryp7a5mbhs1ny0wu3": {
    "categoryId": "bwz5i4eryp7a5mbhs1ny0wu3",
    "categorySlug": "bloky-zhyvlennya-12-24-48v",
    "categoryNameUk": "Блоки живлення 12/24/48V",
    "categoryNameRu": "Блоки питания 12/24/48V",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:11.108Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "tzd2hwqdw8o0hznp770hhsz9": {
    "categoryId": "tzd2hwqdw8o0hznp770hhsz9",
    "categorySlug": "lichylnyky-elektryky",
    "categoryNameUk": "Лічильники електрики",
    "categoryNameRu": "Счетчики электричества",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:11.187Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "xw1mg3yezfqquaqhctg7s6qs": {
    "categoryId": "xw1mg3yezfqquaqhctg7s6qs",
    "categorySlug": "poverbanky",
    "categoryNameUk": "Повербанки",
    "categoryNameRu": "Повербанки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:11.270Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "e84w5jils4gf8ndah5xyimi6": {
    "categoryId": "e84w5jils4gf8ndah5xyimi6",
    "categorySlug": "dyubeli-shvydkoho-montazhu",
    "categoryNameUk": "Дюбелі швидкого монтажу",
    "categoryNameRu": "Дюбелі швидкого монтажу",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:11.353Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "gfsvmt33gprpaxtf0nfhcn3t": {
    "categoryId": "gfsvmt33gprpaxtf0nfhcn3t",
    "categorySlug": "metalorukav-v-pvkh-obolontsi-z-protyazhkoyu",
    "categoryNameUk": "Металорукав в ПВХ-оболонці з протяжкою",
    "categoryNameRu": "Металорукав в ПВХ-оболонці з протяжкою",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:11.439Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "rkaszmrnkbzsgshslrtcf733": {
    "categoryId": "rkaszmrnkbzsgshslrtcf733",
    "categorySlug": "vohnestiykyy-kabel",
    "categoryNameUk": "Вогнестійкий кабель",
    "categoryNameRu": "Вогнестійкий кабель",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:11.624Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ueayfbuva7syol5y15dkbmpz": {
    "categoryId": "ueayfbuva7syol5y15dkbmpz",
    "categorySlug": "dverni-dotyahuvachi",
    "categoryNameUk": "Дверні дотягувачі",
    "categoryNameRu": "Дверные дотягиватели",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:11.714Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ukkldamtpb0h1b9vi7z5gvul": {
    "categoryId": "ukkldamtpb0h1b9vi7z5gvul",
    "categorySlug": "avtonomni-zamky",
    "categoryNameUk": "Автономні замки",
    "categoryNameRu": "Автономні замки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:11.786Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "k88hdzpt7fa2cdsyyouqysmf": {
    "categoryId": "k88hdzpt7fa2cdsyyouqysmf",
    "categorySlug": "vibratsiyna-optovolokonna-syhnalizatsiya",
    "categoryNameUk": "Вібраційна оптоволоконна сигналізація",
    "categoryNameRu": "Вібраційна оптоволоконна сигналізація",
    "params": {
      "distBlock": 2,
      "floorShadowY": 0.8,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:11.859Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "qotvo6o4w2bczkvdcax2bhpb": {
    "categoryId": "qotvo6o4w2bczkvdcax2bhpb",
    "categorySlug": "ich-bar-yery",
    "categoryNameUk": "ІЧ-бар'єри",
    "categoryNameRu": "ІЧ-бар'єри",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:11.942Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "yh0bhng9xoevgx137qlojwsu": {
    "categoryId": "yh0bhng9xoevgx137qlojwsu",
    "categorySlug": "avr-avtomatychne-vvedennya-rezervu",
    "categoryNameUk": "(АВР) Автоматичне введення резерву",
    "categoryNameRu": "(АВР) Автоматический ввод резерва",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:12.022Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "srxnrh4orauuceoie85up1pd": {
    "categoryId": "srxnrh4orauuceoie85up1pd",
    "categorySlug": "ups-dzherelo-bezperebiynoho-zhyvlennya",
    "categoryNameUk": "(UPS) Джерело безперебійного живлення",
    "categoryNameRu": "(UPS) Источник бесперебойного питания",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:12.109Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "zm5z08fvw4rec30byq5po9yq": {
    "categoryId": "zm5z08fvw4rec30byq5po9yq",
    "categorySlug": "invertory",
    "categoryNameUk": "Інвертори",
    "categoryNameRu": "Инвертора",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:12.184Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "qcni2w38t4gi4y3blhzbr1rn": {
    "categoryId": "qcni2w38t4gi4y3blhzbr1rn",
    "categorySlug": "rozpodilchi-bloky-ujb",
    "categoryNameUk": "Розподільчі блоки UJB",
    "categoryNameRu": "Розподільчі блоки UJB",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:12.277Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "oezrye4ljrt0pxr11wyc8me8": {
    "categoryId": "oezrye4ljrt0pxr11wyc8me8",
    "categorySlug": "z-yednuvachi-hermetychni-cnp-ip68-cnp-ip68",
    "categoryNameUk": "З'єднувачі герметичні CNP, IP68 CNP,  IP68",
    "categoryNameRu": "Соеденители герметичные CNP,  IP68",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:12.375Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mpriugterxqvxwrqcepf7l0n": {
    "categoryId": "mpriugterxqvxwrqcepf7l0n",
    "categorySlug": "korobky-rozpodilchi-zakhyshcheni-seriyi-uprobox",
    "categoryNameUk": "Коробки розподільчі захищені серії UProbox",
    "categoryNameRu": "Коробки розподільчі захищені серії UProbox",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:12.446Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "dlt80vvitgg3fg98ulhv3oj5": {
    "categoryId": "dlt80vvitgg3fg98ulhv3oj5",
    "categorySlug": "svitlosyhnalna-armatura-z-indykatorom-napruhy-as-seriyi-u-adm-v",
    "categoryNameUk": "Світлосигнальна арматура з індикатором напруги (АС) серії U-ADM-V",
    "categoryNameRu": "Светосигнальная арматура с индикатором напряжения (АС) серии U-ADM-V",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:12.519Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "n1p0hxgqvnxpoqd1hdmzmzll": {
    "categoryId": "n1p0hxgqvnxpoqd1hdmzmzll",
    "categorySlug": "svitlosyhnalna-armatura-z-indykatorom-napruhy-as-ta-chastoty-seriyi-u-adm-vhz",
    "categoryNameUk": "Світлосигнальна арматура з індикатором напруги (АС) та частоти серії U-ADM-VHz",
    "categoryNameRu": "Светосигнальная арматура с индикатором напряжения (АС) и частотой серии U-ADM-VHz",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:12.591Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "kmashbddm3r1e7pr3m4izh2a": {
    "categoryId": "kmashbddm3r1e7pr3m4izh2a",
    "categorySlug": "svitlosyhnalna-armatura-z-indykatorom-napruhy-as-strumu-ta-chastoty-seriyi-u-adm-vahz",
    "categoryNameUk": "Світлосигнальна арматура з індикатором напруги (АС), струму та частоти серії U-ADM-VAHz",
    "categoryNameRu": "Светосигнальная арматура с индикатором напряжения (АС), тока и частоты серии U-ADM-VAHz",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:12.670Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "mbr9fh17s3qua8thddyso2u9": {
    "categoryId": "mbr9fh17s3qua8thddyso2u9",
    "categorySlug": "svitlosyhnalna-armatura-z-indykatorom-chasu-hod-khv-seriyi-u-adm-hr",
    "categoryNameUk": "Світлосигнальна арматура з індикатором часу (год/хв) серії U-ADM-Hr",
    "categoryNameRu": "Светосигнальная арматура с индикатором времени (час/мин) серии U-ADM-Hr.",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:13.056Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "wjr11vwx257vcc8o20cilazn": {
    "categoryId": "wjr11vwx257vcc8o20cilazn",
    "categorySlug": "svitlosyhnalna-armatura-z-indykatorom-lichylnykom-seriyi-u-adm-s",
    "categoryNameUk": "Світлосигнальна арматура з індикатором-лічильником серії U-ADM-С",
    "categoryNameRu": "Светосигнальная арматура с индикатором-счетчиком серии U-ADM-С",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:13.126Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "g4rofycmhay7sgroob5z7ain": {
    "categoryId": "g4rofycmhay7sgroob5z7ain",
    "categorySlug": "typ-v",
    "categoryNameUk": "Тип В",
    "categoryNameRu": "Тип В",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:13.360Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "mxh1llk67htav3xz4wpa6maj": {
    "categoryId": "mxh1llk67htav3xz4wpa6maj",
    "categorySlug": "kvadratna-3",
    "categoryNameUk": "Квадратна",
    "categoryNameRu": "Квадратная",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:13.729Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "o7446p0eiwb4yat96zxnvlsf": {
    "categoryId": "o7446p0eiwb4yat96zxnvlsf",
    "categorySlug": "prozhektory-vulychni",
    "categoryNameUk": "Прожектори вуличні",
    "categoryNameRu": "Прожекторы уличне",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:13.800Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "pwc3e8iifo7e885syiwg1qk1": {
    "categoryId": "pwc3e8iifo7e885syiwg1qk1",
    "categorySlug": "mini-ups-dlya-routera",
    "categoryNameUk": "Міні UPS (для роутера)",
    "categoryNameRu": "Мини UPS (для роутера)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:13.877Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "r6wldhi0srxre75piur1o38g": {
    "categoryId": "r6wldhi0srxre75piur1o38g",
    "categorySlug": "mini-ups-na-din-reyke",
    "categoryNameUk": "Міні UPS на Din -рейке",
    "categoryNameRu": "Мини UPS на Din -рейке",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:13.962Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "btr4awexz8usiwtsfa76qhmz": {
    "categoryId": "btr4awexz8usiwtsfa76qhmz",
    "categorySlug": "kvadrokoptery",
    "categoryNameUk": "Квадрокоптери",
    "categoryNameRu": "Квадрокоптеры",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:14.264Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "yu6mmqrddtls5pmgaxzqqkca": {
    "categoryId": "yu6mmqrddtls5pmgaxzqqkca",
    "categorySlug": "zakhyst-alternatyvnoho-zhyvlennya",
    "categoryNameUk": "Захист альтернативного живлення",
    "categoryNameRu": "Защита альтернативного питания",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:14.631Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "rdybsc4ql0ugresegvz9p8q1": {
    "categoryId": "rdybsc4ql0ugresegvz9p8q1",
    "categorySlug": "usb-khaby",
    "categoryNameUk": "USB Хаби",
    "categoryNameRu": "USB Хаби",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:14.704Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "bb5qybxptub1liclfh9uj1kv": {
    "categoryId": "bb5qybxptub1liclfh9uj1kv",
    "categorySlug": "blok-zhyvlennya-dlya-smartfona",
    "categoryNameUk": "Блок живлення для смартфона",
    "categoryNameRu": "Блок питания для смартфона",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:14.781Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "r8vjzx7lp2dmfcvpcezgdnvg": {
    "categoryId": "r8vjzx7lp2dmfcvpcezgdnvg",
    "categorySlug": "invertory-ses",
    "categoryNameUk": "Інвертори СЕС",
    "categoryNameRu": "Инверторы СЭС",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:14.851Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "q6d4gp1tb3g4vkdi3heen4c8": {
    "categoryId": "q6d4gp1tb3g4vkdi3heen4c8",
    "categorySlug": "8-0-4-0",
    "categoryNameUk": "8,0/4,0",
    "categoryNameRu": "8,0/4,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:14.932Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "eh1dmb2kfmftkmimuwgj0y14": {
    "categoryId": "eh1dmb2kfmftkmimuwgj0y14",
    "categorySlug": "10-0-5-0",
    "categoryNameUk": "10,0/5,0",
    "categoryNameRu": "10,0/5,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.004Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "wk9jdj8squ3frka5luulcko1": {
    "categoryId": "wk9jdj8squ3frka5luulcko1",
    "categorySlug": "16-0-8-0",
    "categoryNameUk": "16,0/8,0",
    "categoryNameRu": "16,0/8,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.074Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "uvailx3mbbh7dy7600ydcx52": {
    "categoryId": "uvailx3mbbh7dy7600ydcx52",
    "categorySlug": "18-0-9-0",
    "categoryNameUk": "18,0/9,0",
    "categoryNameRu": "18,0/9,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.154Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "fw3vwlqs4h36jlhcwwxll8nc": {
    "categoryId": "fw3vwlqs4h36jlhcwwxll8nc",
    "categorySlug": "25-0-12-5",
    "categoryNameUk": "25,0/12,5",
    "categoryNameRu": "25,0/12,5",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.224Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "iaxf8m5t129t7biyr277m50u": {
    "categoryId": "iaxf8m5t129t7biyr277m50u",
    "categorySlug": "30-0-15-0",
    "categoryNameUk": "30,0/15,0",
    "categoryNameRu": "30,0/15,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.303Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "bz4gc7wgv3caadran3j8rvj0": {
    "categoryId": "bz4gc7wgv3caadran3j8rvj0",
    "categorySlug": "40-0-20-0",
    "categoryNameUk": "40,0/20,0",
    "categoryNameRu": "40,0/20,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.376Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "joxqt0aj5me9957tjmzeiwhw": {
    "categoryId": "joxqt0aj5me9957tjmzeiwhw",
    "categorySlug": "50-0-25-0",
    "categoryNameUk": "50,0/25,0",
    "categoryNameRu": "50,0/25,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.446Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "zw4jqhznchq9wxzrebcpa12f": {
    "categoryId": "zw4jqhznchq9wxzrebcpa12f",
    "categorySlug": "70-0-35-0",
    "categoryNameUk": "70,0/35,0",
    "categoryNameRu": "70,0/35,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.520Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "dea0zi6wzl9pv2hnkmj86ok8": {
    "categoryId": "dea0zi6wzl9pv2hnkmj86ok8",
    "categorySlug": "80-0-40-0",
    "categoryNameUk": "80,0/40,0",
    "categoryNameRu": "80,0/40,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.595Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "qxacpnfjxid2cffa9xm5zsk6": {
    "categoryId": "qxacpnfjxid2cffa9xm5zsk6",
    "categorySlug": "puskachi-v-korpusi-seriyi-pmk-kotushka-230v",
    "categoryNameUk": "Пускачі в корпусі серії ПМК (котушка 230В)",
    "categoryNameRu": "Пускачі в корпусі серії ПМК (котушка 230В)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.826Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "vvqx9z9pi71xw0oxchsgvxgi": {
    "categoryId": "vvqx9z9pi71xw0oxchsgvxgi",
    "categorySlug": "kotushky-do-km",
    "categoryNameUk": "Котушки до КМ",
    "categoryNameRu": "Котушки до КМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.901Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "x2p1mi1p366kuunuv4635a1b": {
    "categoryId": "x2p1mi1p366kuunuv4635a1b",
    "categorySlug": "rele-elektroteplovi-seriyi-rtkm",
    "categoryNameUk": "Реле електротеплові серії РТКМ",
    "categoryNameRu": "Реле електротеплові серії РТКМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:15.974Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "yxdy4vocy9kx7ch6411ljjhj": {
    "categoryId": "yxdy4vocy9kx7ch6411ljjhj",
    "categorySlug": "nakonechnyky-pid-gvynt-rozrizni-bez-izolyatsiyi",
    "categoryNameUk": "Наконечники під ґвинт розрізні без ізоляції",
    "categoryNameRu": "Наконечники під ґвинт розрізні без ізоляції",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.049Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "q068eddclgoryyk15emuebiw": {
    "categoryId": "q068eddclgoryyk15emuebiw",
    "categorySlug": "konektory-rozrizni-bez-izolyatsiyi",
    "categoryNameUk": "Конектори розрізні без ізоляції",
    "categoryNameRu": "Конектори розрізні без ізоляції",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.122Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "uqdlgj5az0i0cyhkxbg5woxe": {
    "categoryId": "uqdlgj5az0i0cyhkxbg5woxe",
    "categorySlug": "roz-yem-shteker-tsylindrychnyy-bez-izolyatsiyi",
    "categoryNameUk": "Роз'єм-штекер циліндричний без ізоляції",
    "categoryNameRu": "Роз'єм-штекер циліндричний без ізоляції",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.194Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "w1k5w6of4zegp59rrfcxqp01": {
    "categoryId": "w1k5w6of4zegp59rrfcxqp01",
    "categorySlug": "zakhysni-kovpachky",
    "categoryNameUk": "Захисні ковпачки",
    "categoryNameRu": "Захисні ковпачки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.266Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "s8tvz7r18y8rzxup0pgjvwfy": {
    "categoryId": "s8tvz7r18y8rzxup0pgjvwfy",
    "categorySlug": "hnuchki-orhanayzery-z-klipsoyu-dlya-kabelyu",
    "categoryNameUk": "Гнучкі органайзери з кліпсою для кабелю",
    "categoryNameRu": "Гнучкі органайзери з кліпсою для кабелю",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.336Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "hv6hls1ej4371cscs4iaydhm": {
    "categoryId": "hv6hls1ej4371cscs4iaydhm",
    "categorySlug": "syhnalni-led-indykatory-sld",
    "categoryNameUk": "Сигнальні LED індикатори SLD",
    "categoryNameRu": "Сигнальні LED індикатори SLD",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.408Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "dsz1a2ljnsa4c4cq8e9gtw1g": {
    "categoryId": "dsz1a2ljnsa4c4cq8e9gtw1g",
    "categorySlug": "izolyator-trymach-stupinchastyy",
    "categoryNameUk": "Ізолятор-тримач ступінчастий",
    "categoryNameRu": "Ізолятор-тримач ступінчастий",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.484Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "wvtthjlaz0dbtflsx86nuk0t": {
    "categoryId": "wvtthjlaz0dbtflsx86nuk0t",
    "categorySlug": "videoreyestratory-tvt",
    "categoryNameUk": "Відеореєстратори TVT",
    "categoryNameRu": "Видеорегистраторы TVT",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.558Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "pc9vi025x3aredn4nfmdnd7t": {
    "categoryId": "pc9vi025x3aredn4nfmdnd7t",
    "categorySlug": "klemni-bloky",
    "categoryNameUk": "Клемні блоки",
    "categoryNameRu": "Клемные блоки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.707Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "f41ybthwxo5fhqq52tkh4pqw": {
    "categoryId": "f41ybthwxo5fhqq52tkh4pqw",
    "categorySlug": "mini-pylky",
    "categoryNameUk": "Міні-пилки",
    "categoryNameRu": "Мини-пилки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.784Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "vl7snndf4z3xamgbcs43ou1s": {
    "categoryId": "vl7snndf4z3xamgbcs43ou1s",
    "categorySlug": "sylovi-roz-yemy-seriyi-ucombi",
    "categoryNameUk": "Силові роз'єми серії UCombi",
    "categoryNameRu": "Силові роз'єми серії UCombi",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.860Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "rd7cip68m1dimncb3fioux3m": {
    "categoryId": "rd7cip68m1dimncb3fioux3m",
    "categorySlug": "podovzhuvachi-pobutovi",
    "categoryNameUk": "Подовжувачі побутові",
    "categoryNameRu": "Удлинители бытовые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:16.932Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "kstrzc13hpwylcb5z6d0cl8b": {
    "categoryId": "kstrzc13hpwylcb5z6d0cl8b",
    "categorySlug": "mikrokhvylovi-datchyky-prysutnosti",
    "categoryNameUk": "Мікрохвильові датчики присутності",
    "categoryNameRu": "Микроволновые датчики присутствия",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.006Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "neonvav5r0wv5813qd868e4j": {
    "categoryId": "neonvav5r0wv5813qd868e4j",
    "categorySlug": "obpryskuvachi-ruchni",
    "categoryNameUk": "Обприскувачі ручні",
    "categoryNameRu": "Опрыскиватели ручные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.076Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "s1o5l1my2z1oka6g3njmx450": {
    "categoryId": "s1o5l1my2z1oka6g3njmx450",
    "categorySlug": "nulova-shyna-v-plastykovomu-korpusi-bc-6v",
    "categoryNameUk": "Нульова шина в пластиковому корпусі BC-6В",
    "categoryNameRu": "Нулевые шины в пластиковом корпусе BC-6В",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.147Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "dezbahk49bnc4em08jm8gv3k": {
    "categoryId": "dezbahk49bnc4em08jm8gv3k",
    "categorySlug": "sylovi-klemy-vvodu",
    "categoryNameUk": "Силові клеми вводу",
    "categoryNameRu": "Силовые клеммы ввода",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.221Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mi42yrkav6hhzorjs42dahsu": {
    "categoryId": "mi42yrkav6hhzorjs42dahsu",
    "categorySlug": "vymykachi-navantazhennya-seriyi-urelix",
    "categoryNameUk": "Вимикачі навантаження серії URelix",
    "categoryNameRu": "Выключатели нагрузки серии URelix",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.300Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "axergiasyn8g1lwbii4cv3vs": {
    "categoryId": "axergiasyn8g1lwbii4cv3vs",
    "categorySlug": "hilzy-alyuminiyevi-z-vidryvnymy-boltamy-glb",
    "categoryNameUk": "Гільзи алюмінієві з відривними болтами GLB",
    "categoryNameRu": "Гильзы алюминиевые с отрывными болтами GLB",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.442Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "hcty0vpw0guosyzhz781m3fq": {
    "categoryId": "hcty0vpw0guosyzhz781m3fq",
    "categorySlug": "ajax",
    "categoryNameUk": "AJAX",
    "categoryNameRu": "AJAX",
    "params": {
      "distBlock": 1,
      "floorShadowY": 0.8,
      "minHoleSize": 99999,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.517Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "m2cfl2kc2rioupqcalg5jcbe": {
    "categoryId": "m2cfl2kc2rioupqcalg5jcbe",
    "categorySlug": "tvt-digital",
    "categoryNameUk": "TVT DIGITAL",
    "categoryNameRu": "TVT DIGITAL",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.594Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "hh0iryt8sxa7qoflgmt08jdt": {
    "categoryId": "hh0iryt8sxa7qoflgmt08jdt",
    "categorySlug": "alternatyvna-enerhetyka",
    "categoryNameUk": "АЛЬТЕРНАТИВНА ЕНЕРГЕТИКА",
    "categoryNameRu": "АЛЬТЕРНАТИВНА ЕНЕРГЕТИКА",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.667Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ttkw2qz055ojsi3ipk1813x1": {
    "categoryId": "ttkw2qz055ojsi3ipk1813x1",
    "categorySlug": "okhoronna-syhnalizatsiya",
    "categoryNameUk": "ОХОРОННА СИГНАЛІЗАЦІЯ",
    "categoryNameRu": "ОХОРОННА СИГНАЛІЗАЦІЯ",
    "params": {
      "distBlock": 2,
      "floorShadowY": 0.8,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.748Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "n49zzazb99he33y5sgdup5ny": {
    "categoryId": "n49zzazb99he33y5sgdup5ny",
    "categorySlug": "pozhezhna-syhnalizatsiya",
    "categoryNameUk": "ПОЖЕЖНА СИГНАЛІЗАЦІЯ",
    "categoryNameRu": "ПОЖЕЖНА СИГНАЛІЗАЦІЯ",
    "params": {
      "distBlock": 2,
      "floorShadowY": 0.8,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.821Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ozzupf76ftb25arpoiljnvco": {
    "categoryId": "ozzupf76ftb25arpoiljnvco",
    "categorySlug": "roz-yemy",
    "categoryNameUk": "РОЗ'ЄМИ",
    "categoryNameRu": "РОЗ'ЄМИ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.900Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "h0h99xfxi9hu9voh9cwrflsj": {
    "categoryId": "h0h99xfxi9hu9voh9cwrflsj",
    "categorySlug": "systemy-pozhezhohasinnya",
    "categoryNameUk": "СИСТЕМИ ПОЖЕЖОГАСІННЯ",
    "categoryNameRu": "СИСТЕМИ ПОЖЕЖОГАСІННЯ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:17.972Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "mo9nnhcaf7xvwv895vqsl4e0": {
    "categoryId": "mo9nnhcaf7xvwv895vqsl4e0",
    "categorySlug": "shafy-ta-stiyky",
    "categoryNameUk": "ШАФИ ТА СТІЙКИ",
    "categoryNameRu": "ШАФИ ТА СТІЙКИ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:18.050Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "eppk9k8jmijphqizi6caaydg": {
    "categoryId": "eppk9k8jmijphqizi6caaydg",
    "categorySlug": "rozprodazh",
    "categoryNameUk": "РОЗПРОДАЖ",
    "categoryNameRu": "РОЗПРОДАЖ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:18.124Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "g6bpncxi9tzle6idv634fvmx": {
    "categoryId": "g6bpncxi9tzle6idv634fvmx",
    "categorySlug": "vse-dlya-peremohy",
    "categoryNameUk": "ВСЕ ДЛЯ ПЕРЕМОГИ",
    "categoryNameRu": "ВСЕ ДЛЯ ПЕРЕМОГИ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:18.200Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "m9g093sk3o1jofpdye3bmzih": {
    "categoryId": "m9g093sk3o1jofpdye3bmzih",
    "categorySlug": "zamky",
    "categoryNameUk": "ЗАМКИ",
    "categoryNameRu": "ЕЛЕКТРООБЛАДНАННЯ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:18.347Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "rn7u5mn0sszdrvlnyq3bxses": {
    "categoryId": "rn7u5mn0sszdrvlnyq3bxses",
    "categorySlug": "zashchipky",
    "categoryNameUk": "ЗАЩІПКИ",
    "categoryNameRu": "ЗАЩІПКИ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:18.418Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "gvo7p3t7bmhzft1lz13cp4k0": {
    "categoryId": "gvo7p3t7bmhzft1lz13cp4k0",
    "categorySlug": "rizne",
    "categoryNameUk": "Різне",
    "categoryNameRu": "Разное",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:18.494Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "g0qixkqth738bb4z4ripl0v6": {
    "categoryId": "g0qixkqth738bb4z4ripl0v6",
    "categorySlug": "suputnykovi-systemy-starlink",
    "categoryNameUk": "Супутникові системи Starlink",
    "categoryNameRu": "Спутниковые системы Starlink",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:18.570Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ribk4cqrfe2y3rufcdwejy8u": {
    "categoryId": "ribk4cqrfe2y3rufcdwejy8u",
    "categorySlug": "rozumnyy-budynok",
    "categoryNameUk": "Розумний будинок",
    "categoryNameRu": "Умный дом",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:18.711Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "zvumkks5kbu8gbu45fyxnz05": {
    "categoryId": "zvumkks5kbu8gbu45fyxnz05",
    "categorySlug": "ustanovchi-kolodky-dlya-promizhnoho-rele-my-mk-ly",
    "categoryNameUk": "Установчі колодки для проміжного реле MY, MK, LY",
    "categoryNameRu": "Установочные колодки для промежуточного реле MY, MK, LY",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:19.129Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "qvd2cpahroihqwcxp8zb1bdz": {
    "categoryId": "qvd2cpahroihqwcxp8zb1bdz",
    "categorySlug": "nakonechnyk-bez-izolyatsiyi-midnyy-ludzhenyy-scb",
    "categoryNameUk": "Наконечник без ізоляції мідний луджений SCB",
    "categoryNameRu": "Наконечник без изоляции медный лужен SCB",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:19.200Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "katwea2ifx26lgd0hwv83rsn": {
    "categoryId": "katwea2ifx26lgd0hwv83rsn",
    "categorySlug": "kleyki-strichky",
    "categoryNameUk": "Клейкі стрічки",
    "categoryNameRu": "Клейкие ленты",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:19.275Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "qt9ctv2zkobu0s042xiopz9p": {
    "categoryId": "qt9ctv2zkobu0s042xiopz9p",
    "categorySlug": "routery",
    "categoryNameUk": "Роутери",
    "categoryNameRu": "Роутеры",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:19.352Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "zftosimiv06rz8iacv6v9kxb": {
    "categoryId": "zftosimiv06rz8iacv6v9kxb",
    "categorySlug": "komutatory",
    "categoryNameUk": "Комутатори",
    "categoryNameRu": "Комутатори",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:19.423Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "b96t5rq4vswcijhobjva23lu": {
    "categoryId": "b96t5rq4vswcijhobjva23lu",
    "categorySlug": "marshrutyzatory",
    "categoryNameUk": "Маршрутизатори",
    "categoryNameRu": "Маршрутизатори",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:19.497Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mywjgrah0mbcfccmqgfx5u5r": {
    "categoryId": "mywjgrah0mbcfccmqgfx5u5r",
    "categorySlug": "tochky-dostupu",
    "categoryNameUk": "Точки доступу",
    "categoryNameRu": "Точки доступа",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:19.583Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "bv9iiw5onmpq6jpaxsvuzit1": {
    "categoryId": "bv9iiw5onmpq6jpaxsvuzit1",
    "categorySlug": "kompresometry",
    "categoryNameUk": "Компресометри",
    "categoryNameRu": "Компресометри",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:19.729Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "f9ab3a9vrj11x3hkvok41y3r": {
    "categoryId": "f9ab3a9vrj11x3hkvok41y3r",
    "categorySlug": "kronshteyny-1",
    "categoryNameUk": "Кронштейни",
    "categoryNameRu": "Кронштейни",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:19.800Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "keyn8zebfdrozjgyovxzddor": {
    "categoryId": "keyn8zebfdrozjgyovxzddor",
    "categorySlug": "komplekty-ip-videosposterezhennya",
    "categoryNameUk": "Комплекти IP-відеоспостереження",
    "categoryNameRu": "Комплекты IP-видеонаблюдения",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:19.945Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "efny0m13rnd3p4lfln2gl794": {
    "categoryId": "efny0m13rnd3p4lfln2gl794",
    "categorySlug": "infrachervoni-prozhektory",
    "categoryNameUk": "Інфрачервоні прожектори",
    "categoryNameRu": "Инфракрасные прожекторы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:20.017Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "i81o9d0dulqjh1awntxswcss": {
    "categoryId": "i81o9d0dulqjh1awntxswcss",
    "categorySlug": "videopaneli",
    "categoryNameUk": "Відеопанелі",
    "categoryNameRu": "Видеопанели",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:20.093Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "dryak3u2gd2nm8ysormclask": {
    "categoryId": "dryak3u2gd2nm8ysormclask",
    "categorySlug": "komplekt-videodomofonu",
    "categoryNameUk": "Комплект відеодомофону",
    "categoryNameRu": "Комплект видеодомофона",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:20.171Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "n7x1qe9n06lauz9xclpf173l": {
    "categoryId": "n7x1qe9n06lauz9xclpf173l",
    "categorySlug": "audiodomofony",
    "categoryNameUk": "Аудіодомофони",
    "categoryNameRu": "Аудиодомофоны",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:20.240Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "iysgxb04yfg6yqn22ulv1cnf": {
    "categoryId": "iysgxb04yfg6yqn22ulv1cnf",
    "categorySlug": "aksesuary-dlya-domofoniyi",
    "categoryNameUk": "Аксесуари для домофонії",
    "categoryNameRu": "Аксессуары для домофонии",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:20.314Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "sv9x62eefpndjg69v8tb4ib5": {
    "categoryId": "sv9x62eefpndjg69v8tb4ib5",
    "categorySlug": "huchnomovtsi",
    "categoryNameUk": "Гучномовці",
    "categoryNameRu": "Громкоговорители",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:20.386Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ns0jhl3k5y1oa4zbxwzo6030": {
    "categoryId": "ns0jhl3k5y1oa4zbxwzo6030",
    "categorySlug": "mikshery-i-pidsylyuvachi",
    "categoryNameUk": "Мікшери і підсилювачі",
    "categoryNameRu": "Микшеры и усилители",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:20.525Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "em1ose0fjcad7toxoyywxygz": {
    "categoryId": "em1ose0fjcad7toxoyywxygz",
    "categorySlug": "aksesuary-dlya-zvukovoho-opovishchennya",
    "categoryNameUk": "Аксесуари для звукового оповіщення",
    "categoryNameRu": "Аксессуары для звукового оповещения",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:20.595Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "lkdjgvcsnal80vy6d9j6d4m1": {
    "categoryId": "lkdjgvcsnal80vy6d9j6d4m1",
    "categorySlug": "izolyatsiyna-strichka",
    "categoryNameUk": "Ізоляційна стрічка",
    "categoryNameRu": "Изоляционная лента",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:20.882Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "wqx3nvuigzmlz8z162hkrkp7": {
    "categoryId": "wqx3nvuigzmlz8z162hkrkp7",
    "categorySlug": "perforovani-plastmasovi-koroba",
    "categoryNameUk": "Перфоровані Пластмасові короба",
    "categoryNameRu": "Пластмассовые перфорированные короба",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:20.955Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ukh1p4xan0tkrg5xoy2hyhdc": {
    "categoryId": "ukh1p4xan0tkrg5xoy2hyhdc",
    "categorySlug": "avtomatychni-vymykachi-seriyi-ukrem-va-2017",
    "categoryNameUk": "Автоматичні вимикачі серії УКРЕМ ВА-2017",
    "categoryNameRu": "Автоматические выключатели серии УКРЕМ ВА-2017",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:21.339Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ms4s940bbxredotyiffc5nec": {
    "categoryId": "ms4s940bbxredotyiffc5nec",
    "categorySlug": "dyferentsialni-avtomatychni-vymykachi-bez-zakhystu-vid-nadstrumu-pzv",
    "categoryNameUk": "Диференціальні автоматичні вимикачі без захисту від надструму (ПЗВ)",
    "categoryNameRu": "Дифференциальные автоматические выключатели без защиты от сверхтока (УЗО)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:21.426Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mwh655xk06753zymi8y84f9c": {
    "categoryId": "mwh655xk06753zymi8y84f9c",
    "categorySlug": "promyslovi-plavki-zapobizhnyky-seriyi-nh",
    "categoryNameUk": "Промислові плавкі запобіжники серії NH",
    "categoryNameRu": "Промышленные плавкие предохранители серии NH",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:21.499Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mnnqe3gosdxmfyi2t0aovt24": {
    "categoryId": "mnnqe3gosdxmfyi2t0aovt24",
    "categorySlug": "kotushky-keruvannya",
    "categoryNameUk": "Котушки керування",
    "categoryNameRu": "Катушки управления",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:21.574Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "d1covjy1q9lgo3n82gmuug9t": {
    "categoryId": "d1covjy1q9lgo3n82gmuug9t",
    "categorySlug": "seriya-1khkhkh",
    "categoryNameUk": "Серія 1ххх",
    "categoryNameRu": "Серия 1ххх",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:21.646Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "trt4xr8jiphn5wgvxcxzqhku": {
    "categoryId": "trt4xr8jiphn5wgvxcxzqhku",
    "categorySlug": "aksesuary-do-knopok-seriy-khv2-lay5-tb5",
    "categoryNameUk": "Аксесуари до кнопок серій ХВ2, LAY5, TB5",
    "categoryNameRu": "Аксессуары для кнопок серий ХВ2, LAY5, TB5",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:21.717Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "cxduagqcbjglwm32bnt1ppvb": {
    "categoryId": "cxduagqcbjglwm32bnt1ppvb",
    "categorySlug": "knopkovi-vymykachi-roz-yem-roz-yednuvachi-seriyi-bs",
    "categoryNameUk": "Кнопкові вимикачі-роз'єм роз'єднувачі серії BS",
    "categoryNameRu": "Кнопочные выключатели-разъединители серии BS",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:21.789Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "l36jxjrsciwgxoj725a5pkm0": {
    "categoryId": "l36jxjrsciwgxoj725a5pkm0",
    "categorySlug": "svitlosyhnalna-armatura-seriyi-pl",
    "categoryNameUk": "Світлосигнальна арматура серії PL",
    "categoryNameRu": "Светосигнальная арматура серии PL",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:21.873Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "yjtub5yhbzo2g7chifuomq3p": {
    "categoryId": "yjtub5yhbzo2g7chifuomq3p",
    "categorySlug": "ampermetry-analohovi",
    "categoryNameUk": "Амперметри аналогові",
    "categoryNameRu": "Амперметры аналоговые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:21.954Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "npu7r3v9nw0zs5algsylc4st": {
    "categoryId": "npu7r3v9nw0zs5algsylc4st",
    "categorySlug": "gvyntovi-zazemlyuyuchi-kontaktni-zatyskachi-na-din-reyku-seriyi-jb-ek",
    "categoryNameUk": "Ґвинтові заземлюючі контактні затискачі на DIN-рейку серії JB(ЕК)",
    "categoryNameRu": "Винтовые заземляющие контактные зажимы на DIN-рейке серии JB(ЕК)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:22.097Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "na2z3zvjxjine6oapn07sv6x": {
    "categoryId": "na2z3zvjxjine6oapn07sv6x",
    "categorySlug": "klema-z-yednannya-yednuvalna-universalna-prokhidna-pct-2",
    "categoryNameUk": "Клема з'єднання єднувальна універсальна прохідна PCT-2",
    "categoryNameRu": "Клемма соединительная универсальная проходная PCT-2",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:22.250Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "k1oqs8grnpkyl9c54uj9lt61": {
    "categoryId": "k1oqs8grnpkyl9c54uj9lt61",
    "categorySlug": "metalevi-kabelni-salnyky-seriyi-pgm",
    "categoryNameUk": "Металеві кабельні сальники серії PGM",
    "categoryNameRu": "Металлические кабельные сальники серии PGM",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:22.324Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "dilox0zsovnep2ilrc3utrnv": {
    "categoryId": "dilox0zsovnep2ilrc3utrnv",
    "categorySlug": "spiralna-obv-yazka-dlya-drotu",
    "categoryNameUk": "Спіральна обв'язка для дроту",
    "categoryNameRu": "Спиральная обвязка для провода",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:22.469Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "gwqgmm5yofg74n62b2w2r660": {
    "categoryId": "gwqgmm5yofg74n62b2w2r660",
    "categorySlug": "midnykh-ta-alyuminiyevykh-kabeliv",
    "categoryNameUk": "Мідних та алюмінієвих кабелів",
    "categoryNameRu": "Медных и алюминиевых кабелей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:22.607Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "v3d0781phs4nj909wxx75dn0": {
    "categoryId": "v3d0781phs4nj909wxx75dn0",
    "categorySlug": "hidravlichnyy-pompovyy-z-vynosnym-nasosom",
    "categoryNameUk": "Гідравлічний помповий (з виносним насосом).",
    "categoryNameRu": "Гидравлический насосный (с выносным насосом).",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:22.678Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "zaw9jm686ai9ae1uon0eu3zb": {
    "categoryId": "zaw9jm686ai9ae1uon0eu3zb",
    "categorySlug": "luzhni-elementy-zhyvlennya-dlya-pultiv",
    "categoryNameUk": "Лужні елементи живлення для пультів",
    "categoryNameRu": "Щелочные элементы питания для пультов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:22.817Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "w0f71x93k97wmazcevv4jqbv": {
    "categoryId": "w0f71x93k97wmazcevv4jqbv",
    "categorySlug": "rozetky-vrizni-seriyi-hv",
    "categoryNameUk": "Розетки врізні серії ГВ",
    "categoryNameRu": "Розетки врезные серии ГВ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:22.887Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "dshbiuitl90vkjvwsuzioids": {
    "categoryId": "dshbiuitl90vkjvwsuzioids",
    "categorySlug": "nakonechnyky-midni-seriyi-dt",
    "categoryNameUk": "Наконечники мідні серії DT",
    "categoryNameRu": "Наконечники медные серии DT",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:22.959Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "c0p3m6y7l8vc33lbcur6ocmw": {
    "categoryId": "c0p3m6y7l8vc33lbcur6ocmw",
    "categorySlug": "nakonechnyky-midni-seriyi-dt-g",
    "categoryNameUk": "Наконечники мідні серії DT(G)",
    "categoryNameRu": "Наконечники медные серии DT(G)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.031Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "kjphko4cy1nmm2bxkieeaja1": {
    "categoryId": "kjphko4cy1nmm2bxkieeaja1",
    "categorySlug": "nakonechnyky-alyuminiyevi-seriyi-dl",
    "categoryNameUk": "Наконечники алюмінієві серії DL",
    "categoryNameRu": "Наконечники алюминиевые серии DL",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.101Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "rgkbcxdq90o4m23qfn97awv0": {
    "categoryId": "rgkbcxdq90o4m23qfn97awv0",
    "categorySlug": "nakonechnyky-kiltsevi-seriyi-rv",
    "categoryNameUk": "Наконечники кільцеві серії RV",
    "categoryNameRu": "Наконечники кольцевые серии RV",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.174Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "tg2rn28ai1v2558czcddkgv0": {
    "categoryId": "tg2rn28ai1v2558czcddkgv0",
    "categorySlug": "shyny-nulovi-u-plastmasovomu-korpusi-seriyi-vs-6a",
    "categoryNameUk": "Шини нульові у пластмасовому корпусі серії ВС-6А",
    "categoryNameRu": "Шины нулевые в пластмассовом корпусе серии ВС-6А",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.315Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "lv79qxsodhzfbvanfcpalvpf": {
    "categoryId": "lv79qxsodhzfbvanfcpalvpf",
    "categorySlug": "bokovyy-fiksator-ew-35",
    "categoryNameUk": "Боковий фіксатор EW-35",
    "categoryNameRu": "Боковой фиксатор EW-35",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.388Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "l7gbbe6x4t7xy1upxpus3l84": {
    "categoryId": "l7gbbe6x4t7xy1upxpus3l84",
    "categorySlug": "khomuty-z-maydanchykom-pid-hvynt",
    "categoryNameUk": "Хомути з майданчиком під гвинт",
    "categoryNameRu": "Хомуты с площадкой под винт",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.461Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "mgop1savb9fpvuu4718bhycq": {
    "categoryId": "mgop1savb9fpvuu4718bhycq",
    "categorySlug": "maydanchyky-dlya-khomutiv-na-kleyoviy-osnovi",
    "categoryNameUk": "Майданчики для хомутів на клейовій основі",
    "categoryNameRu": "Площадки для хомутов на клеевой основе",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.531Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "rh6g843jvv3i5nqxiew7jgkq": {
    "categoryId": "rh6g843jvv3i5nqxiew7jgkq",
    "categorySlug": "rozpodilchi-korobky-seriyi-ty-ra",
    "categoryNameUk": "Розподільчі коробки серії TY-RA",
    "categoryNameRu": "Распределительные коробки серии TY-RA",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.604Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "awojaixo73kt6z1atatml1u3": {
    "categoryId": "awojaixo73kt6z1atatml1u3",
    "categorySlug": "dlya-betonnykh-tsehlyanykh-stin",
    "categoryNameUk": "Для бетонних, цегляних стін",
    "categoryNameRu": "Для бетонных, кирпичных стен.",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.673Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "h4a582x5sh96i32jhcs99rwf": {
    "categoryId": "h4a582x5sh96i32jhcs99rwf",
    "categorySlug": "shurupokruty-merezhevi",
    "categoryNameUk": "Шурупокрути мережеві",
    "categoryNameRu": "Шуруповерты сетевые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.746Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "x0wthpv8nn3bpyg4lcjiv2tl": {
    "categoryId": "x0wthpv8nn3bpyg4lcjiv2tl",
    "categorySlug": "kraskopulty-elektrychni",
    "categoryNameUk": "Краскопульти електричні",
    "categoryNameRu": "Краскопульты электрические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.821Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "didi8kwmvbulniw36waw45dw": {
    "categoryId": "didi8kwmvbulniw36waw45dw",
    "categorySlug": "obtyskachi-dlya-porshnevykh-kilets",
    "categoryNameUk": "Обтискачі для поршневих кілець",
    "categoryNameRu": "Обжимы для поршневых колец",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.890Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "qv1gkc8xjb1ku2qu8rlpas2f": {
    "categoryId": "qv1gkc8xjb1ku2qu8rlpas2f",
    "categorySlug": "napivavtomaty-mig-mag",
    "categoryNameUk": "Напівавтомати  MIG/MAG",
    "categoryNameRu": "Полуавтоматы MIG/MAG",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:23.974Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "arxui9q2er3ojegw3bm37u3p": {
    "categoryId": "arxui9q2er3ojegw3bm37u3p",
    "categorySlug": "nerzhaviyuchyy-zvaryuvalnyy-drit-mig",
    "categoryNameUk": "Нержавіючий зварювальний дріт MIG",
    "categoryNameRu": "Нержавеющая сварочная проволока MIG",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:24.113Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "rpehgioe6uj416f06gl44vy3": {
    "categoryId": "rpehgioe6uj416f06gl44vy3",
    "categorySlug": "zvaryuvalni-palnyky-tig",
    "categoryNameUk": "Зварювальні пальники TIG",
    "categoryNameRu": "Сварочные горелки TIG",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:24.251Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "tcvqhmzfapyyvhndcvwd7zru": {
    "categoryId": "tcvqhmzfapyyvhndcvwd7zru",
    "categorySlug": "elektrodotrymachi",
    "categoryNameUk": "Електродотримачі",
    "categoryNameRu": "Электрододержатели",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:24.328Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "tikksdwlgnuxk1amewg8qmsx": {
    "categoryId": "tikksdwlgnuxk1amewg8qmsx",
    "categorySlug": "bahatofunktsionalni-zvaryuvalni-aparaty",
    "categoryNameUk": "Багатофункціональні зварювальні апарати",
    "categoryNameRu": "Мультифункциональные сварочные аппараты",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:24.398Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "k7xss5rje1cmz03e92c1p303": {
    "categoryId": "k7xss5rje1cmz03e92c1p303",
    "categorySlug": "vvh-vinil-vinil-holyy",
    "categoryNameUk": "ВВГ (Вініл-Вініл-Голий)",
    "categoryNameRu": "ВВГ (Винил-Винил-Голый)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:24.473Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "wotipeusf5xc9kuypj8jjbga": {
    "categoryId": "wotipeusf5xc9kuypj8jjbga",
    "categorySlug": "instrument-dlya-ozdoblyuvalnykh-robit",
    "categoryNameUk": "Інструмент для оздоблювальних робіт",
    "categoryNameRu": "Инструмент для отделочных работ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:24.544Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "c8w1v2hmzj1p6hmi2uvqrka3": {
    "categoryId": "c8w1v2hmzj1p6hmi2uvqrka3",
    "categorySlug": "instrument-stolyarnyy",
    "categoryNameUk": "Інструмент столярний",
    "categoryNameRu": "Инструмент столярный",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:24.694Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "lfbwvr7wgeqo1txel4ilezt8": {
    "categoryId": "lfbwvr7wgeqo1txel4ilezt8",
    "categorySlug": "prynalezhnosti",
    "categoryNameUk": "Приналежності",
    "categoryNameRu": "Принадлежности",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:24.764Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "g444o0jgbj2wqijav99n5o55": {
    "categoryId": "g444o0jgbj2wqijav99n5o55",
    "categorySlug": "instrument-akumulyatornyy",
    "categoryNameUk": "Інструмент акумуляторний",
    "categoryNameRu": "Инструмент аккумуляторный",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:24.840Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mvgslbds8e5lbuoc7jxkym0v": {
    "categoryId": "mvgslbds8e5lbuoc7jxkym0v",
    "categorySlug": "prystroyi-pidhotovky-ta-ochyshchennya-povitrya",
    "categoryNameUk": "Пристрої підготовки та очищення повітря",
    "categoryNameRu": "Устройства подготовки и очистки воздуха",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:25.124Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "l3pdje5bgye1f1ntr1rwcm7r": {
    "categoryId": "l3pdje5bgye1f1ntr1rwcm7r",
    "categorySlug": "kosyntsi-budivelni",
    "categoryNameUk": "Косинці будівельні",
    "categoryNameRu": "Угольники строительные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:25.197Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "cx60j3qd7s2rvjevpz70nnml": {
    "categoryId": "cx60j3qd7s2rvjevpz70nnml",
    "categorySlug": "zatirky-z-nerzhaviyuchoyi-stali",
    "categoryNameUk": "Затірки з нержавіючої сталі",
    "categoryNameRu": "Затирки из нержавеющей стали",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:25.268Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "plryhj7p5ff82tm99yod6pjw": {
    "categoryId": "plryhj7p5ff82tm99yod6pjw",
    "categorySlug": "zaklepochnyky-mekhanichni",
    "categoryNameUk": "Заклепочники механічні",
    "categoryNameRu": "Заклепочники механические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:25.485Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "o4fjtzrj32i0rwn97nt3zywo": {
    "categoryId": "o4fjtzrj32i0rwn97nt3zywo",
    "categorySlug": "robochyy-odyah",
    "categoryNameUk": "Робочий одяг",
    "categoryNameRu": "Рабочая одежда",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:25.592Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "am7kebjo6n3vbcm3e5qhzr2e": {
    "categoryId": "am7kebjo6n3vbcm3e5qhzr2e",
    "categorySlug": "shurupokruty-akumulyatorni",
    "categoryNameUk": "Шурупокрути акумуляторні",
    "categoryNameRu": "Шуруповерты аккумуляторные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:25.666Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "fdijjtt2dby8s6ckzcxozl5a": {
    "categoryId": "fdijjtt2dby8s6ckzcxozl5a",
    "categorySlug": "shlifmashyny-pryami-pnevmatychni",
    "categoryNameUk": "Шліфмашини прямі пневматичні",
    "categoryNameRu": "Шлифмашины прямые пневматические",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:25.736Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "ya74w9x755rz1fm5foe1grej": {
    "categoryId": "ya74w9x755rz1fm5foe1grej",
    "categorySlug": "nozhivky-po-derevu",
    "categoryNameUk": "Ножівки по дереву",
    "categoryNameRu": "Ножовки по дереву",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:25.814Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mk76wvjfdrw67297bpnbcb1w": {
    "categoryId": "mk76wvjfdrw67297bpnbcb1w",
    "categorySlug": "vykrutky-i-otvertochnykh-nasadky",
    "categoryNameUk": "Викрутки і отверточних насадки",
    "categoryNameRu": "Отвертки и отверточные насадки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:25.883Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "oxa4yg62y4t2ohmxlm40m2jo": {
    "categoryId": "oxa4yg62y4t2ohmxlm40m2jo",
    "categorySlug": "nozhytsi-armaturni",
    "categoryNameUk": "Ножиці арматурні",
    "categoryNameRu": "Ножницы арматурные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:25.953Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "bp9msnvirf4z7t3280919o4x": {
    "categoryId": "bp9msnvirf4z7t3280919o4x",
    "categorySlug": "nozhi-prorizni",
    "categoryNameUk": "Ножі прорізні",
    "categoryNameRu": "Ножи прорезные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.101Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "m63mg48ml3bgrjnyrj4ujzam": {
    "categoryId": "m63mg48ml3bgrjnyrj4ujzam",
    "categorySlug": "kola-nazhdakovi-samokleyuchi",
    "categoryNameUk": "Кола наждакові самоклеючі",
    "categoryNameRu": "Круги наждачные самоклеящиеся",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.176Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "efic84p8qrr5uqgzncwtexd5": {
    "categoryId": "efic84p8qrr5uqgzncwtexd5",
    "categorySlug": "molotky",
    "categoryNameUk": "Молотки",
    "categoryNameRu": "Молотки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.247Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "iitgyl9qfsrg8sy423ri9sbp": {
    "categoryId": "iitgyl9qfsrg8sy423ri9sbp",
    "categorySlug": "rukavychky-robochi-humovi-nitrylovi-pvc-lateksni",
    "categoryNameUk": "Рукавички робочі гумові (нітрилові, PVC, латексні)",
    "categoryNameRu": "Перчатки рабочие резиновые (нитриловые, PVC, латексные)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.319Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "fs6dw3981mdtude9xaw12hfu": {
    "categoryId": "fs6dw3981mdtude9xaw12hfu",
    "categorySlug": "frezy-tortsevi-z-almaznoyu-krykhtoyu-dlya-ushm",
    "categoryNameUk": "Фрези торцеві з алмазною крихтою для УШМ",
    "categoryNameRu": "Фрези торцеві з алмазною крихтою для УШМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.392Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "tded2wr0io7mrjsn8u1kanfw": {
    "categoryId": "tded2wr0io7mrjsn8u1kanfw",
    "categorySlug": "remkomplekty-dlya-farbopultiv",
    "categoryNameUk": "Ремкомплекти для фарбопультів",
    "categoryNameRu": "Ремкомплекты для краскопультов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.464Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ejz8m75mmmrwcjn7nm2djvcj": {
    "categoryId": "ejz8m75mmmrwcjn7nm2djvcj",
    "categorySlug": "vykrutky-udarni",
    "categoryNameUk": "Викрутки ударні",
    "categoryNameRu": "Отвертки ударные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.544Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ux8bm2u52amscuwagre095f9": {
    "categoryId": "ux8bm2u52amscuwagre095f9",
    "categorySlug": "vykrutkovi-nasadky",
    "categoryNameUk": "Викруткові насадки",
    "categoryNameRu": "Отверточные насадки",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.621Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "dbx6ne19r1ft87qyixdht7r4": {
    "categoryId": "dbx6ne19r1ft87qyixdht7r4",
    "categorySlug": "klishchi-tortsevi-dlya-tsvyakhiv",
    "categoryNameUk": "Кліщі торцеві для цвяхів",
    "categoryNameRu": "Клещи торцевые для гвоздей",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.693Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "xc1n9dcp770a8no5xznrvlmk": {
    "categoryId": "xc1n9dcp770a8no5xznrvlmk",
    "categorySlug": "dysky-vidrizni-z-diamantovoyu-krykhtoyu-dlya-ushm",
    "categoryNameUk": "Диски відрізні з діамантовою крихтою для УШМ",
    "categoryNameRu": "Диски відрізні з діамантовою крихтою для УШМ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.769Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ye14zl9q0iwr910jpuu019jg": {
    "categoryId": "ye14zl9q0iwr910jpuu019jg",
    "categorySlug": "vymiryuvachi-tysku-v-shynakh",
    "categoryNameUk": "Вимірювачі тиску в шинах",
    "categoryNameRu": "Измерители давления в шинах",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.840Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "v5fwcmoconuy9mql18vxi32e": {
    "categoryId": "v5fwcmoconuy9mql18vxi32e",
    "categorySlug": "vykrutky-shlitsevi",
    "categoryNameUk": "Викрутки шліцеві",
    "categoryNameRu": "Отвертки шлицевые",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:26.925Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "s12aqqlx986fu656fmcxpcer": {
    "categoryId": "s12aqqlx986fu656fmcxpcer",
    "categorySlug": "prystroyi-puskozaryadni-dlya-akb",
    "categoryNameUk": "Пристрої пускозарядні для АКБ",
    "categoryNameRu": "Устройства пускозарядные для АКБ",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.000Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "oog9baqdzkugk6bjs4oo8zax": {
    "categoryId": "oog9baqdzkugk6bjs4oo8zax",
    "categorySlug": "klyuchi-balonni-rotorni",
    "categoryNameUk": "Ключі балонні роторні",
    "categoryNameRu": "Ключи баллонные роторные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.088Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "dkbgiv9d6dli0zw12c0xpdqm": {
    "categoryId": "dkbgiv9d6dli0zw12c0xpdqm",
    "categorySlug": "mma-ruchne-duhove-zvaryuvannya-1",
    "categoryNameUk": "ММА (Ручне дугове зварювання)",
    "categoryNameRu": "ММА (Ручная дуговая сварка)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.165Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "wta9xiyq3gsr7n4nu8086dug": {
    "categoryId": "wta9xiyq3gsr7n4nu8086dug",
    "categorySlug": "mig-mag-napivavtomatychne-zvaryuvannya",
    "categoryNameUk": "MIG/MAG (Напівавтоматичне зварювання)",
    "categoryNameRu": "MIG/MAG (Полуавтоматическая сварка)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.253Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "mv3rrdypeuv1jizaltljkank": {
    "categoryId": "mv3rrdypeuv1jizaltljkank",
    "categorySlug": "tig-arhonoduhove-zvaryuvannya",
    "categoryNameUk": "TIG (Аргонодугове зварювання)",
    "categoryNameRu": "TIG (Аргонодуговая сварка)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.325Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "h8rtvymr00jungcd9budjj09": {
    "categoryId": "h8rtvymr00jungcd9budjj09",
    "categorySlug": "kruh-vidriznyy",
    "categoryNameUk": "Круг відрізний",
    "categoryNameRu": "Круг отрезной",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.401Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "xbhv9vbr2v9c62vkxtfwgrok": {
    "categoryId": "xbhv9vbr2v9c62vkxtfwgrok",
    "categorySlug": "kolyuchi-rozvidni",
    "categoryNameUk": "Колючі розвідні",
    "categoryNameRu": "Колючи разводные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.544Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "z31physn9fxk9s986ykgigez": {
    "categoryId": "z31physn9fxk9s986ykgigez",
    "categorySlug": "sverdla-k-pnevmodrilyam",
    "categoryNameUk": "Свердла к пневмодрілям",
    "categoryNameRu": "Сверла к пневмодрелям",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.614Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "y8uvbrd2lw3nbivhru4ju4hf": {
    "categoryId": "y8uvbrd2lw3nbivhru4ju4hf",
    "categorySlug": "shchupy-dlya-vymiryuvannya-zazoriv",
    "categoryNameUk": "Щупи для вимірювання зазорів",
    "categoryNameRu": "Щупы для измерения зазоров",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.684Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "veqxjdbjwfv38njn79luui0s": {
    "categoryId": "veqxjdbjwfv38njn79luui0s",
    "categorySlug": "strubtsyny",
    "categoryNameUk": "Струбцини",
    "categoryNameRu": "Струбцины",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.756Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "ocvwiaz7wprn98pumq1gfd91": {
    "categoryId": "ocvwiaz7wprn98pumq1gfd91",
    "categorySlug": "pryladdya-dlya-hraveriv",
    "categoryNameUk": "Приладдя для граверів",
    "categoryNameRu": "Принадлежности для граверов",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.901Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "fciu40btj8tudfn7q8tlb2yg": {
    "categoryId": "fciu40btj8tudfn7q8tlb2yg",
    "categorySlug": "kasky-ta-nakolinnyky",
    "categoryNameUk": "Каски та наколінники",
    "categoryNameRu": "Каски та наколінники",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:27.971Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "lnsnrd78dyr95dvobodfa1zm": {
    "categoryId": "lnsnrd78dyr95dvobodfa1zm",
    "categorySlug": "prynalezhnosti-do-elektrychnykh-trimmera",
    "categoryNameUk": "Приналежності до електричних тріммера",
    "categoryNameRu": "Принадлежности к электрическим триммерам",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:28.040Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "tpbhvlhrzzkjwytbaezqug3y": {
    "categoryId": "tpbhvlhrzzkjwytbaezqug3y",
    "categorySlug": "svitlodiodni-lampy",
    "categoryNameUk": "Світлодіодні лампи",
    "categoryNameRu": "Світлодіодні лампи",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:28.184Z",
    "sampleStats": {
      "totalSampled": 9,
      "qaPassed": 8,
      "passRatio": 0.8888888888888888
    }
  },
  "dd8fovamr5gfk28nz0akrikq": {
    "categoryId": "dd8fovamr5gfk28nz0akrikq",
    "categorySlug": "shpateli-z-nerzhaviyuchoyi-stali",
    "categoryNameUk": "Шпателі з нержавіючої сталі",
    "categoryNameRu": "Шпатели из нержавеющей стали",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:28.256Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "s149x73bjl6amga2mgq56yai": {
    "categoryId": "s149x73bjl6amga2mgq56yai",
    "categorySlug": "nasadky-dlya-polyvannya",
    "categoryNameUk": "Насадки для поливання",
    "categoryNameRu": "Насадки для поливу",
    "params": {
      "distBlock": 0,
      "floorShadowY": 0.85,
      "minHoleSize": 99999
    },
    "calibratedAt": "2026-06-02T19:02:28.327Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "wwn0d16r4x6xg0gjgw0p11nw": {
    "categoryId": "wwn0d16r4x6xg0gjgw0p11nw",
    "categorySlug": "nozhytsi-dlya-stryzhky-travy-i-obrizky-hilok",
    "categoryNameUk": "Ножиці для стрижки трави і обрізки гілок",
    "categoryNameRu": "Ножиці для стрижки трави і обрізки гілок",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:28.400Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "jgrsku5kxtf9s9mmag19lxii": {
    "categoryId": "jgrsku5kxtf9s9mmag19lxii",
    "categorySlug": "hidroizolyatsiya-pokrivli",
    "categoryNameUk": "Гідроізоляція покрівлі",
    "categoryNameRu": "Гидроизоляция кровли",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:28.473Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "zi3n56u7i8det9b8qj0a27q5": {
    "categoryId": "zi3n56u7i8det9b8qj0a27q5",
    "categorySlug": "hidroizolyatsiya-rezervuariv",
    "categoryNameUk": "Гідроізоляція резервуарів",
    "categoryNameRu": "Гидроизоляция резервуаров",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:28.544Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "u09zh4puvrchnf03903goog9": {
    "categoryId": "u09zh4puvrchnf03903goog9",
    "categorySlug": "prynalezhnosti-do-skhodiv",
    "categoryNameUk": "Приналежності до сходів",
    "categoryNameRu": "Приналежности для лесниц",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:28.615Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "nycydw78uy819d6yigof5tt7": {
    "categoryId": "nycydw78uy819d6yigof5tt7",
    "categorySlug": "strubtsyny-avtomat",
    "categoryNameUk": "Струбцини автомат",
    "categoryNameRu": "Струбцины автомат",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:28.769Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "vnmkiwg33fgrg6ww6r0w4lox": {
    "categoryId": "vnmkiwg33fgrg6ww6r0w4lox",
    "categorySlug": "sitka-abrazyvna",
    "categoryNameUk": "Сітка абразивна",
    "categoryNameRu": "Сітка абразивна",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:28.839Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "tiw7qo8wvjbpbtvjuyegr4pd": {
    "categoryId": "tiw7qo8wvjbpbtvjuyegr4pd",
    "categorySlug": "lomy-i-tsvyakhosmyky",
    "categoryNameUk": "Ломи і цвяхосмики",
    "categoryNameRu": "Ломы и гвоздодермы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:28.911Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "axfp3o9rnqdkr27y3f4mvsm6": {
    "categoryId": "axfp3o9rnqdkr27y3f4mvsm6",
    "categorySlug": "sverdla-dlya-betonu",
    "categoryNameUk": "Свердла для бетону",
    "categoryNameRu": "Сверла по бетону",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:28.981Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "lyiwek5wp4n6y58jfhnd9zry": {
    "categoryId": "lyiwek5wp4n6y58jfhnd9zry",
    "categorySlug": "klyuchi-dlya-zatysku-patrona",
    "categoryNameUk": "Ключі для затиску патрона",
    "categoryNameRu": "Ключи для зажима патрона",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:29.052Z",
    "sampleStats": {
      "totalSampled": 3,
      "qaPassed": 3,
      "passRatio": 1
    }
  },
  "dwn0532sxdmmb5j85y4dqy23": {
    "categoryId": "dwn0532sxdmmb5j85y4dqy23",
    "categorySlug": "perekhidnyky-dlya-patrona",
    "categoryNameUk": "Перехідники для патрона",
    "categoryNameRu": "Переходники для патрона",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:29.122Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "zy1lb2g7u076sajdwioiyb2v": {
    "categoryId": "zy1lb2g7u076sajdwioiyb2v",
    "categorySlug": "perekhidnyky-sds-plus-i-sds-max",
    "categoryNameUk": "Перехідники SDS -Plus і SDS - Max",
    "categoryNameRu": "Переходники SDS-Plus и SDS - Max",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:29.193Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "h605f1740850clastomfbzts": {
    "categoryId": "h605f1740850clastomfbzts",
    "categorySlug": "klyuchi-shestyhranni-h-obrazni",
    "categoryNameUk": "Ключі шестигранні Г- образні",
    "categoryNameRu": "Ключи шестигранные Г-образные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:29.265Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "vkp0gccuez3qvof4a4ifnkh4": {
    "categoryId": "vkp0gccuez3qvof4a4ifnkh4",
    "categorySlug": "khomuty-plastykovi-styazhky-neylonovi",
    "categoryNameUk": "Хомути пластикові ( стяжки нейлонові )",
    "categoryNameRu": "Хомуты пластиковые (стяжки нейлоновые)",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:29.405Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "ppdyhsxkrwjhc4jptvkkxiwv": {
    "categoryId": "ppdyhsxkrwjhc4jptvkkxiwv",
    "categorySlug": "gu5-3-gu10",
    "categoryNameUk": "GU5.3-GU10",
    "categoryNameRu": "GU5.3-GU10",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:29.476Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "mfb7jg4izid9aury37bcuwfe": {
    "categoryId": "mfb7jg4izid9aury37bcuwfe",
    "categorySlug": "sklorizy",
    "categoryNameUk": "Склорізи",
    "categoryNameRu": "Склорізи",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:29.557Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "mdn48v9gaweb9lfxf5pooni1": {
    "categoryId": "mdn48v9gaweb9lfxf5pooni1",
    "categorySlug": "keramichna-cherepytsya-hanergy",
    "categoryNameUk": "Керамічна черепиця Hanergy",
    "categoryNameRu": "Керамическая черепица Hanergy",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:29.626Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "nspy3kyuwkbbua8t42jwqye1": {
    "categoryId": "nspy3kyuwkbbua8t42jwqye1",
    "categorySlug": "klemni-zatyskachi-kintsevi-10kh1-seriyi-s",
    "categoryNameUk": "Клемні затискачі кінцеві 10х1 серії С",
    "categoryNameRu": "Клемні затискачі кінцеві 10х1 серії С",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:29.711Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "rrum2onk8i9md3bxa42ggak3": {
    "categoryId": "rrum2onk8i9md3bxa42ggak3",
    "categorySlug": "peremykachi-modulni-i-0-ii-seriyi-rpv",
    "categoryNameUk": "Перемикачі модульні (І-0-ІІ) серії RPV",
    "categoryNameRu": "Перемикачі модульні (І-0-ІІ) серії RPV",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:29.864Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "so0gphvflx741r6humjclxl9": {
    "categoryId": "so0gphvflx741r6humjclxl9",
    "categorySlug": "roz-yemy-konektory-z-yednuvachi-dlya-sks",
    "categoryNameUk": "Роз'єми, конектори, з'єднувачі для СКС",
    "categoryNameRu": "Роз'єми, конектори, з'єднувачі для СКС",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:29.938Z",
    "sampleStats": {
      "totalSampled": 1,
      "qaPassed": 1,
      "passRatio": 1
    }
  },
  "l3szppuwoyez6aqlmmt41129": {
    "categoryId": "l3szppuwoyez6aqlmmt41129",
    "categorySlug": "motopylky-lantsyuhovi-benzopyly",
    "categoryNameUk": "Мотопилки ланцюгові ( бензопили )",
    "categoryNameRu": "Мотопилки ланцюгові ( бензопили )",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:30.012Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "c6zn1szvngqsd5l4j4cop3de": {
    "categoryId": "c6zn1szvngqsd5l4j4cop3de",
    "categorySlug": "navisni",
    "categoryNameUk": "Навісні",
    "categoryNameRu": "Навесные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:30.091Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "axzwbkbanmbam0h4mnya5j9e": {
    "categoryId": "axzwbkbanmbam0h4mnya5j9e",
    "categorySlug": "klemy-mahistralni-z-zakhysnoyu-kryshkoyu",
    "categoryNameUk": "Клеми магістральні з захисною кришкою",
    "categoryNameRu": "Клеммы магистральные с защитной крышкой",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:30.160Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "bdbap8ym4s6vkyua5fgp013a": {
    "categoryId": "bdbap8ym4s6vkyua5fgp013a",
    "categorySlug": "ip65",
    "categoryNameUk": "IP65",
    "categoryNameRu": "IP65",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:30.453Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "v9jyjba3gsqwhf21j9y00n2r": {
    "categoryId": "v9jyjba3gsqwhf21j9y00n2r",
    "categorySlug": "navisni-light",
    "categoryNameUk": "Навісні Light",
    "categoryNameRu": "Навісні Light",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:30.523Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "oeye8cq1i6b00nrb1qrj01g3": {
    "categoryId": "oeye8cq1i6b00nrb1qrj01g3",
    "categorySlug": "ip54-1",
    "categoryNameUk": "IP54",
    "categoryNameRu": "IP54",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:30.598Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "q16xkn9wv0gx2db4sn3xm05l": {
    "categoryId": "q16xkn9wv0gx2db4sn3xm05l",
    "categorySlug": "sylovi-avtomatychni-vymykach-va-e-utrust",
    "categoryNameUk": "Силові автоматичні вимикач ВА E UTrust",
    "categoryNameRu": "Силовые автоматические переключатели ВА E UTrust",
    "params": {
      "distBlock": 1,
      "floorShadowY": 0.9,
      "minHoleSize": 99999,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:30.672Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "uvpw20vs50eyckanrrv41hy2": {
    "categoryId": "uvpw20vs50eyckanrrv41hy2",
    "categorySlug": "dopomizhni-instrumenty-i-prystosuvannya",
    "categoryNameUk": "Допоміжні інструменти і пристосування",
    "categoryNameRu": "Вспомогательные инструменты и приспособления",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:30.818Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "jjr2ixva16qm75h9f64ksmc6": {
    "categoryId": "jjr2ixva16qm75h9f64ksmc6",
    "categorySlug": "dyzelni-elektroheneratory",
    "categoryNameUk": "Дизельні електрогенератори",
    "categoryNameRu": "Дизельные электрогенераторы",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:30.894Z",
    "sampleStats": {
      "totalSampled": 7,
      "qaPassed": 6,
      "passRatio": 0.8571428571428571
    }
  },
  "qzugra3httyas384kzjywsen": {
    "categoryId": "qzugra3httyas384kzjywsen",
    "categorySlug": "kabelni-zatyskachi-pid-dyubel",
    "categoryNameUk": "Кабельні затискачі під дюбель",
    "categoryNameRu": "Кабельні затискачі під дюбель",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:30.972Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "vt9ua99yqm0j80lfxn4t8gjv": {
    "categoryId": "vt9ua99yqm0j80lfxn4t8gjv",
    "categorySlug": "typ-a",
    "categoryNameUk": "Тип А",
    "categoryNameRu": "Тип А",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:31.256Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "kdtp5d7m5f04jqnjrv8q2jdv": {
    "categoryId": "kdtp5d7m5f04jqnjrv8q2jdv",
    "categorySlug": "kruhla-3",
    "categoryNameUk": "Кругла",
    "categoryNameRu": "Круглая",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:31.327Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "j5f7arpx5r8zww60970webct": {
    "categoryId": "j5f7arpx5r8zww60970webct",
    "categorySlug": "6-0-3-0",
    "categoryNameUk": "6,0/3,0",
    "categoryNameRu": "6,0/3,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:31.466Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "t2f8jtl4xldf7x12o7dkvuyt": {
    "categoryId": "t2f8jtl4xldf7x12o7dkvuyt",
    "categorySlug": "12-0-6-0",
    "categoryNameUk": "12,0/6,0",
    "categoryNameRu": "12,0/6,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:31.536Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "xwu0cm57486a6rsdbgv2hwl4": {
    "categoryId": "xwu0cm57486a6rsdbgv2hwl4",
    "categorySlug": "20-0-10-0",
    "categoryNameUk": "20,0/10,0",
    "categoryNameRu": "20,0/10,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:31.607Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "xko2g1mt91fsugqufpbfd6mk": {
    "categoryId": "xko2g1mt91fsugqufpbfd6mk",
    "categorySlug": "60-0-30-0",
    "categoryNameUk": "60,0/30,0",
    "categoryNameRu": "60,0/30,0",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:31.687Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "jaebhv4m7n6wle8wudy0i8js": {
    "categoryId": "jaebhv4m7n6wle8wudy0i8js",
    "categorySlug": "nabory-termousadzhuvalnykh-trubok-z-kleyovym-sharom-seriyi-tsk",
    "categoryNameUk": "Набори термоусаджувальних трубок з клейовим шаром серії ТСК",
    "categoryNameRu": "Набори термоусаджувальних трубок з клейовим шаром серії ТСК",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:31.765Z",
    "sampleStats": {
      "totalSampled": 8,
      "qaPassed": 7,
      "passRatio": 0.875
    }
  },
  "f3alq3kxbaho8qgr80gfzb9c": {
    "categoryId": "f3alq3kxbaho8qgr80gfzb9c",
    "categorySlug": "avtomobilni-zaryadni-prystroyi",
    "categoryNameUk": "Автомобільні зарядні пристрої",
    "categoryNameRu": "Автомобильные зарядные устройства",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:31.906Z",
    "sampleStats": {
      "totalSampled": 2,
      "qaPassed": 2,
      "passRatio": 1
    }
  },
  "wv9b125lyw2rkihkpybcze0z": {
    "categoryId": "wv9b125lyw2rkihkpybcze0z",
    "categorySlug": "spiralni-kabelni-vvody-seriyi-pgs",
    "categoryNameUk": "Спіральні кабельні вводи серії PGS",
    "categoryNameRu": "Спиральные кабельные вводы серии PGS",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:31.977Z",
    "sampleStats": {
      "totalSampled": 6,
      "qaPassed": 5,
      "passRatio": 0.8333333333333334
    }
  },
  "wow4mgg8tip9ye8qjvtyc5lq": {
    "categoryId": "wow4mgg8tip9ye8qjvtyc5lq",
    "categorySlug": "nakonechnyk-bez-izolyatsiyi-midnyy-ludzhenyy-skt",
    "categoryNameUk": "Наконечник без ізоляції мідний луджений SKT",
    "categoryNameRu": "Наконечник без изоляции медный лужен SKT",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:32.049Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "zydpdkcrhi4z2m89qipbwb26": {
    "categoryId": "zydpdkcrhi4z2m89qipbwb26",
    "categorySlug": "lebidky-barabanni",
    "categoryNameUk": "Лебідки барабанні",
    "categoryNameRu": "Лебедки барабанные",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:32.119Z",
    "sampleStats": {
      "totalSampled": 5,
      "qaPassed": 5,
      "passRatio": 1
    }
  },
  "sh2576jny9v2ohhjqqsrjlvp": {
    "categoryId": "sh2576jny9v2ohhjqqsrjlvp",
    "categorySlug": "videodomofon",
    "categoryNameUk": "Відеодомофон",
    "categoryNameRu": "Видеодомофон",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:32.193Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  },
  "n0lvyjtzagscp456h7lhlg74": {
    "categoryId": "n0lvyjtzagscp456h7lhlg74",
    "categorySlug": "kompleksy-bahatotsilovoho-opovishchennya",
    "categoryNameUk": "Комплекси багатоцільового оповіщення",
    "categoryNameRu": "Комплексы многоцелевого оповещения",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:32.265Z",
    "sampleStats": {
      "totalSampled": 4,
      "qaPassed": 4,
      "passRatio": 1
    }
  },
  "lmynagipb2bd7ui3ixhan673": {
    "categoryId": "lmynagipb2bd7ui3ixhan673",
    "categorySlug": "other-products",
    "categoryNameUk": "Інші товари",
    "categoryNameRu": "Другие товары",
    "params": {
      "distBlock": 3,
      "floorShadowY": 0.75,
      "minHoleSize": 800,
      "skipQa": true
    },
    "calibratedAt": "2026-06-02T19:02:32.342Z",
    "sampleStats": {
      "totalSampled": 10,
      "qaPassed": 9,
      "passRatio": 0.9
    }
  }
};

/**
 * Получает параметры для категории по её ID, с поддержкой наследования от родителя.
 */
export function getCategoryImageProfile(
  categoryId: string,
  parentMap: Map<string, string> // id -> parentId
): ImageArbitrationConfig | null {
  let currentId: string | undefined = categoryId;
  
  while (currentId) {
    const profile = IMAGE_PROFILES[currentId];
    if (profile && profile.params) {
      return profile.params;
    }
    currentId = parentMap.get(currentId);
  }
  
  return null;
}
