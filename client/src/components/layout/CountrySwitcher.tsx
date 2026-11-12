
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { RootState } from '../../store';
import { setRegionDetails } from '../../store';
import { api } from '../../api/client';

type Region = {
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  vatRate: number;
};

const mockRegions: Region[] = [
  {
    code: 'UZB',
    name: 'Uzbekistan',
    currencyCode: 'UZS',
    currencySymbol: "so'm",
    vatRate: 0.15,
  },
  {
    code: 'KAZ',
    name: 'Kazakhstan',
    currencyCode: 'KZT',
    currencySymbol: '\u20B8',
    vatRate: 0.20,
  },
  {
    code: 'GEO',
    name: 'Georgia',
    currencyCode: 'GEL',
    currencySymbol: '\u20BE',
    vatRate: 0.12,
  },
  {
    code: 'UKR',
    name: 'Ukraine',
    currencyCode: 'UAH',
    currencySymbol: '\u20B4',
    vatRate: 0.08,
  },
  {
    code: 'CHN',
    name: 'China',
    currencyCode: 'CNY',
    currencySymbol: '\u00A5',
    vatRate: 0.18,
  },
];

function parseRegions(body: unknown): Region[] {
  if (
    typeof body !== 'object' ||
    body === null
  ) {
    return [];
  }

  const payload = body as Record<string, unknown>;

  if (!Array.isArray(payload.data)) {
    return [];
  }

  return payload.data.flatMap((item): Region[] => {
    if (
      typeof item !== 'object' ||
      item === null
    ) {
      return [];
    }

    const region = item as Record<string, unknown>;

    if (
      typeof region.code !== 'string' ||
      !/^[A-Z]{3}$/.test(region.code) ||
      typeof region.name !== 'string' ||
      typeof region.currencyCode !== 'string' ||
      typeof region.currencySymbol !== 'string' ||
      typeof region.vatRate !== 'number' ||
      !Number.isFinite(region.vatRate) ||
      region.vatRate < 0 ||
      region.active === false
    ) {
      return [];
    }

    return [{
      code: region.code,
      name: region.name,
      currencyCode: region.currencyCode,
      currencySymbol: region.currencySymbol,
      vatRate: region.vatRate / 100,
    }];
  });
}

export default function CountrySwitcher() {
  const dispatch = useDispatch();

  const selectedCode = useSelector(
    (state: RootState) => state.region.code
  );

  const [regions, setRegions] = useState<Region[]>(
    mockRegions
  );

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRegions() {
      try {
        const response = await api.get<unknown>(
          '/v1/catalog/regions',
          { signal: controller.signal }
        );

        const apiRegions = parseRegions(response.data);

        if (apiRegions.length === 0) {
          throw new Error('Invalid regions response');
        }

        if (!controller.signal.aborted) {
          setRegions(apiRegions);
        }
      } catch {
        if (!controller.signal.aborted) {
          setRegions(mockRegions);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoaded(true);
        }
      }
    }

    void loadRegions();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const selectedRegion =
      regions.find(
        (region) => region.code === selectedCode
      ) ?? regions[0];

    if (selectedRegion) {
      dispatch(setRegionDetails(selectedRegion));
    }
  }, [dispatch, loaded, regions, selectedCode]);

  function handleChange(code: string) {
    const selectedRegion = regions.find(
      (region) => region.code === code
    );

    if (!selectedRegion) {
      return;
    }

    dispatch(setRegionDetails(selectedRegion));

    localStorage.setItem(
      'cc_region',
      selectedRegion.code
    );
  }

  return (
    <label className="cc-country-switcher">
      <span>{'\u0421\u0442\u0440\u0430\u043D\u0430'}</span>

      <select
        value={selectedCode}
        onChange={(event) =>
          handleChange(event.target.value)
        }
        aria-label="Choose country"
      >
        {!regions.some(
          (region) => region.code === selectedCode
        ) && (
          <option value={selectedCode}>
            {selectedCode}
          </option>
        )}

        {regions.map((region) => (
          <option
            key={region.code}
            value={region.code}
          >
            {region.code} - {region.name}
          </option>
        ))}
      </select>
    </label>
  );
}
