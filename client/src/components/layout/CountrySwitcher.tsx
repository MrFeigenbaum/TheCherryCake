import { useDispatch, useSelector } from 'react-redux';

import { setRegionCode } from '../../store';
import type { RootState } from '../../store';

const countries = [
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KG', name: 'Kyrgyzstan' },
];

export default function CountrySwitcher() {
  const dispatch = useDispatch();
  const code = useSelector((state: RootState) => state.region.code);

  function handleChange(newCode: string) {
    localStorage.setItem('cc_region', newCode);
    dispatch(setRegionCode(newCode));
  }

  return (
    <label className="cc-country-switcher">
      <span>Country</span>

      <select
        aria-label="Select country"
        value={countries.some((country) => country.code === code) ? code : 'UZ'}
        onChange={(event) => handleChange(event.target.value)}
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </label>
  );
}
