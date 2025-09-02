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
