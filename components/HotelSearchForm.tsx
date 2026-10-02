// components/HotelSearchForm.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { publicApi } from "@/lib/api/publicApi";

export type HotelSearchValues = {
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  rooms: number;
  city_id: number | null;
};

type LocationItem = {
  id: number;
  type: "country" | "province" | "city";
  name: string;
  code: string;
  slug: string;
  parent?: {
    id: number;
    name: string;
    type: "country" | "province";
    parent?: {
      id: number;
      name: string;
      type: "country";
    };
  } | null;
};

type AutocompleteResponse = {
  query: string | null;
  data: {
    countries: LocationItem[];
    provinces: LocationItem[];
    cities: LocationItem[];
  };
  count: number;
};

type HotelSearchFormProps = {
  onSearch?: (values: HotelSearchValues) => void;
  initialValues?: Partial<HotelSearchValues>;
};

const today = new Date();
const todayStr = today.toISOString().split("T")[0];

export const HotelSearchForm = ({
  onSearch,
  initialValues,
}: HotelSearchFormProps) => {
  const [values, setValues] = useState<HotelSearchValues>({
    check_in: initialValues?.check_in || todayStr,
    check_out: initialValues?.check_out || "",
    adults: initialValues?.adults ?? 1,
    children: initialValues?.children ?? 0,
    rooms: initialValues?.rooms ?? 1,
    city_id: initialValues?.city_id ?? null,
  });

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AutocompleteResponse["data"]>({
    countries: [],
    provinces: [],
    cities: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const adjustMinCheckout = useCallback(
    (checkIn: string) => {
      setValues((prev) => {
        if (checkIn && prev.check_out && prev.check_out <= checkIn) {
          const next = new Date(checkIn);
          next.setDate(next.getDate() + 1);
          const nextStr = next.toISOString().split("T")[0];
          return { ...prev, check_out: nextStr };
        }
        return prev;
      });
    },
    []
  );

  const fetchLocations = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions({ countries: [], provinces: [], cities: [] });
      return;
    }

    setLoading(true);
    try {
      const { data } = await publicApi.get<AutocompleteResponse>(
        `/locations/autocomplete`,
        { params: { q } }
      );
      setSuggestions(data?.data ?? { countries: [], provinces: [], cities: [] });
    } catch {
      setSuggestions({ countries: [], provinces: [], cities: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchLocations(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchLocations]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!values.check_in) {
      newErrors.check_in = "Check-in wajib diisi";
    } else if (values.check_in < todayStr) {
      newErrors.check_in = "Check-in tidak boleh di masa lalu";
    }

    if (!values.check_out) {
      newErrors.check_out = "Check-out wajib diisi";
    } else if (values.check_out <= values.check_in) {
      newErrors.check_out = "Check-out harus setelah check-in";
    } else {
      const diff =
        (new Date(values.check_out).getTime() -
          new Date(values.check_in).getTime()) /
        (1000 * 60 * 60 * 24);
      if (diff > 30) {
        newErrors.check_out = "Maksimal 30 malam";
      }
    }

    if (values.adults < 1) {
      newErrors.adults = "Minimal 1 dewasa";
    }

    if (values.children < 0) {
      newErrors.children = "Tidak boleh negatif";
    }

    if (values.rooms < 1) {
      newErrors.rooms = "Minimal 1 kamar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (!values.city_id) {
      setErrors((prev) => ({
        ...prev,
        city_id: "Silakan pilih kota dari daftar lokasi",
      }));
      return;
    }

    onSearch?.(values);
  };

  const handleSelectCity = (item: LocationItem) => {
    setValues((prev) => ({ ...prev, city_id: item.id }));
    setQuery(item.name);
    setIsOpen(false);
    setSuggestions({ countries: [], provinces: [], cities: [] });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.city_id;
      return next;
    });
  };

  const hasSuggestions =
    suggestions.countries.length > 0 ||
    suggestions.provinces.length > 0 ||
    suggestions.cities.length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lokasi */}
        <div className="relative" ref={containerRef}>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Lokasi
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setValues((prev) => ({ ...prev, city_id: null }));
            }}
            onFocus={() => {
              if (hasSuggestions || query) setIsOpen(true);
            }}
            placeholder="Cari kota..."
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.city_id ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.city_id && (
            <p className="text-xs text-red-600 mt-1">{errors.city_id}</p>
          )}

          {isOpen &&
            (loading ? (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-500">
                Mencari lokasi...
              </div>
            ) : hasSuggestions ? (
              <div className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                {suggestions.countries.length > 0 && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                    Negara
                  </div>
                )}
                {suggestions.countries.map((item) => (
                  <button
                    key={`country-${item.id}`}
                    type="button"
                    onClick={() => handleSelectCity(item)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-gray-700"
                  >
                    {item.name}
                    <span className="ml-2 text-xs text-gray-400">
                      ({item.type})
                    </span>
                  </button>
                ))}

                {suggestions.provinces.length > 0 && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-t border-gray-100">
                    Provinsi
                  </div>
                )}
                {suggestions.provinces.map((item) => (
                  <button
                    key={`province-${item.id}`}
                    type="button"
                    onClick={() => handleSelectCity(item)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-gray-700"
                  >
                    {item.name}
                    <span className="ml-2 text-xs text-gray-400">
                      ({item.type})
                    </span>
                  </button>
                ))}

                {suggestions.cities.length > 0 && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-t border-gray-100">
                    Kota
                  </div>
                )}
                {suggestions.cities.map((item) => (
                  <button
                    key={`city-${item.id}`}
                    type="button"
                    onClick={() => handleSelectCity(item)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-gray-700"
                  >
                    {item.name}
                    <span className="ml-2 text-xs text-gray-400">
                      ({item.type})
                    </span>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-500">
                Tidak ada lokasi ditemukan
              </div>
            ) : null)}
        </div>

        {/* Check In */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <input
            type="date"
            min={todayStr}
            value={values.check_in}
            onChange={(e) => {
              const v = e.target.value;
              setValues((prev) => {
                const next = { ...prev, check_in: v };
                adjustMinCheckout(v);
                return next;
              });
              if (errors.check_in) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.check_in;
                  return next;
                });
              }
            }}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.check_in ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.check_in && (
            <p className="text-xs text-red-600 mt-1">{errors.check_in}</p>
          )}
        </div>

        {/* Check Out */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <input
            type="date"
            min={values.check_in || todayStr}
            value={values.check_out}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, check_out: e.target.value }));
              if (errors.check_out) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.check_out;
                  return next;
                });
              }
            }}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.check_out ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.check_out && (
            <p className="text-xs text-red-600 mt-1">{errors.check_out}</p>
          )}
        </div>

        {/* Adults */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Dewasa
          </label>
          <select
            value={values.adults}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                adults: Math.max(1, Number(e.target.value)),
              }))
            }
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.adults ? "border-red-400" : "border-gray-300"
            }`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {errors.adults && (
            <p className="text-xs text-red-600 mt-1">{errors.adults}</p>
          )}
        </div>

        {/* Children */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Anak
          </label>
          <select
            value={values.children}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                children: Math.max(0, Number(e.target.value)),
              }))
            }
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.children ? "border-red-400" : "border-gray-300"
            }`}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {errors.children && (
            <p className="text-xs text-red-600 mt-1">{errors.children}</p>
          )}
        </div>

        {/* Rooms */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Kamar
          </label>
          <select
            value={values.rooms}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                rooms: Math.max(1, Number(e.target.value)),
              }))
            }
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.rooms ? "border-red-400" : "border-gray-300"
            }`}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {errors.rooms && (
            <p className="text-xs text-red-600 mt-1">{errors.rooms}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="mt-5 flex items-center justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cari Hotel
        </button>
      </div>
    </form>
  );
};
