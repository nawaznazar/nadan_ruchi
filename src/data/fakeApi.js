// Fake Qatar Address API data

export const qatarData = {
  zones: [
    {
      zone_number: "69",
      zone_name_en: "Doha Corniche",
      streets: [
        {
          street_number: "101",
          street_name_en: "Corniche St",
          buildings: [{ building_number: "12" }, { building_number: "45" }, { building_number: "78" }]
        },
        {
          street_number: "102",
          street_name_en: "Museum St",
          buildings: [{ building_number: "5" }, { building_number: "25" }]
        }
      ]
    },
    {
      zone_number: "70",
      zone_name_en: "Al Sadd",
      streets: [
        {
          street_number: "201",
          street_name_en: "Al Sadd St",
          buildings: [{ building_number: "15" }, { building_number: "36" }]
        },
        {
          street_number: "202",
          street_name_en: "Sports Roundabout St",
          buildings: [{ building_number: "7" }, { building_number: "88" }]
        }
      ]
    },
    {
      zone_number: "71",
      zone_name_en: "The Pearl",
      streets: [
        {
          street_number: "301",
          street_name_en: "Porto Arabia Dr",
          buildings: [{ building_number: "10" }, { building_number: "55" }]
        },
        {
          street_number: "302",
          street_name_en: "Qanat Quartier St",
          buildings: [{ building_number: "8" }, { building_number: "19" }]
        }
      ]
    },
    {
      zone_number: "72",
      zone_name_en: "West Bay",
      streets: [
        {
          street_number: "401",
          street_name_en: "Diplomatic St",
          buildings: [{ building_number: "101" }, { building_number: "145" }]
        },
        {
          street_number: "402",
          street_name_en: "Conference Centre St",
          buildings: [{ building_number: "77" }, { building_number: "120" }]
        }
      ]
    },
    {
      zone_number: "73",
      zone_name_en: "Lusail",
      streets: [
        {
          street_number: "501",
          street_name_en: "Lusail Marina St",
          buildings: [{ building_number: "22" }, { building_number: "66" }]
        },
        {
          street_number: "502",
          street_name_en: "Fox Hills Blvd",
          buildings: [{ building_number: "9" }, { building_number: "45" }]
        }
      ]
    },
    {
      zone_number: "74",
      zone_name_en: "Al Wakrah",
      streets: [
        {
          street_number: "601",
          street_name_en: "Al Wakrah Main St",
          buildings: [{ building_number: "12" }, { building_number: "39" }]
        },
        {
          street_number: "602",
          street_name_en: "Souq Wakrah Rd",
          buildings: [{ building_number: "7" }, { building_number: "27" }]
        }
      ]
    }
  ]
};

// Simulate API calls
export const fakeApi = {
  getZones: () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(qatarData.zones), 500);
    }),

  getStreets: (zone_number) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const zone = qatarData.zones.find((z) => z.zone_number === zone_number);
        resolve(zone ? zone.streets : []);
      }, 500);
    }),

  getBuildings: (zone_number, street_number) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const zone = qatarData.zones.find((z) => z.zone_number === zone_number);
        const street = zone?.streets.find((s) => s.street_number === street_number);
        resolve(street ? street.buildings : []);
      }, 500);
    }),
};
