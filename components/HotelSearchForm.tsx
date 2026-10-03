// components/HotelSearchForm.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { publicApi } from "@/lib/api/publicApi";
import { Icon } from "@iconify/react";

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

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: string, b: string) {
  if (!a || !b) return false;
  return a === b;
}

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const Calendar = ({
  checkIn,
  checkOut,
  onSelect,
  minDate,
}: {
  checkIn: string;
  checkOut: string;
  onSelect: (inDate: string, outDate: string) => void;
  minDate: string;
}) => {
  const todayDate = new Date(minDate + "T00:00:00");
  const [viewYear, setViewYear] = useState(todayDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth());
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(dateStr);
  }

  const isInRange = (dateStr: string) => {
    if (!checkIn) return false;
    if (checkOut) {
      return dateStr > checkIn && dateStr < checkOut;
    }
    if (hoverDate && hoverDate > checkIn) {
      return dateStr > checkIn && dateStr < hoverDate;
    }
    return false;
  };

  const handleClick = (dateStr: string) => {
    if (dateStr < minDate) return;

    if (!checkIn || (checkIn && checkOut)) {
      onSelect(dateStr, "");
    } else if (dateStr > checkIn) {
      onSelect(checkIn, dateStr);
    } else {
      onSelect(dateStr, "");
    }
  };

  const prevMonth = () => {
    const { year, month } = addMonths(viewYear, viewMonth, -1);
    setViewYear(year);
    setViewMonth(month);
  };

  const nextMonth = () => {
    const { year, month } = addMonths(viewYear, viewMonth, 1);
    setViewYear(year);
    setViewMonth(month);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-80 select-none">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
        >
          <Icon icon="mdi:chevron-left" width="20" />
        </button>
        <span className="text-sm font-semibold text-gray-800">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
        >
          <Icon icon="mdi:chevron-right" width="20" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((dateStr, idx) => {
          if (!dateStr) return <div key={`empty-${idx}`} className="p-1" />;

          const disabled = dateStr < minDate;
          const selected = isSameDay(dateStr, checkIn) || isSameDay(dateStr, checkOut);
          const inRange = isInRange(dateStr);

          let cellClass =
            "w-full aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer transition ";

          if (selected) {
            cellClass += "bg-blue-600 text-white font-semibold ";
          } else if (inRange) {
            cellClass += "bg-blue-50 text-blue-700 ";
          } else if (disabled) {
            cellClass += "text-gray-300 cursor-not-allowed ";
          } else {
            cellClass += "text-gray-700 hover:bg-gray-100 ";
          }

          return (
            <button
              key={dateStr}
              type="button"
              disabled={disabled}
              onClick={() => handleClick(dateStr)}
              onMouseEnter={() => !disabled && setHoverDate(dateStr)}
              onMouseLeave={() => setHoverDate(null)}
              className={cellClass}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Counter = ({
  label,
  value,
  onChangeValue,
  min = 1,
  max = 10,
}: {
  label: string;
  value: number;
  onChangeValue: (v: number) => void;
  min?: number;
  max?: number;
}) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-gray-700">{label}</span>
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChangeValue(Math.max(min, value - 1))}
        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <Icon icon="mdi:minus" width="16" />
      </button>
      <span className="text-sm font-semibold text-gray-800 w-5 text-center">
        {value}
      </span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChangeValue(Math.min(max, value + 1))}
        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <Icon icon="mdi:plus" width="16" />
      </button>
    </div>
  </div>
);

const GuestSelector = ({
  adults,
  childCount,
  rooms,
  onChange,
}: {
  adults: number;
  childCount: number;
  rooms: number;
  onChange: (v: Partial<HotelSearchValues>) => void;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-72">
      <Counter
        label="Kamar"
        value={rooms}
        min={1}
        max={10}
        onChangeValue={(v) => onChange({ rooms: v })}
      />
      <div className="border-t border-gray-100" />
      <Counter
        label="Dewasa"
        value={adults}
        min={1}
        max={10}
        onChangeValue={(v) => onChange({ adults: v })}
      />
      <div className="border-t border-gray-100" />
      <Counter
        label="Anak"
        value={childCount}
        min={0}
        max={10}
        onChangeValue={(v) => onChange({ children: v })}
      />
    </div>
  );
};

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
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchLocations = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions({ countries: [], provinces: [], cities: [] });
      return;
    }

    setLoading(true);
    try {
      const { data } = await publicApi.get<AutocompleteResponse>(
        "/locations/autocomplete",
        { params: { q } }
      );
      setSuggestions(
        data?.data ?? { countries: [], provinces: [], cities: [] }
      );
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
        setIsLocationOpen(false);
        setIsCalendarOpen(false);
        setIsGuestOpen(false);
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
    setIsLocationOpen(false);
    setSuggestions({ countries: [], provinces: [], cities: [] });
    setErrors((prev) => {
      const next = { ...prev };
      delete next.city_id;
      return next;
    });
  };

  const handleCalendarSelect = (inDate: string, outDate: string) => {
    setValues((prev) => {
      let newCheckOut = outDate;
      if (!newCheckOut && prev.check_out && prev.check_out > inDate) {
        newCheckOut = prev.check_out;
      }
      if (newCheckOut && newCheckOut <= inDate) {
        const d = new Date(inDate);
        d.setDate(d.getDate() + 1);
        newCheckOut = d.toISOString().split("T")[0];
      }
      return { ...prev, check_in: inDate, check_out: newCheckOut };
    });
    if (outDate) setIsCalendarOpen(false);

    setErrors((prev) => {
      const next = { ...prev };
      delete next.check_in;
      delete next.check_out;
      return next;
    });
  };

  const handleGuestChange = (partial: Partial<HotelSearchValues>) => {
    setValues((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.adults;
      delete next.children;
      delete next.rooms;
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
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 w-full"
    >
      <div className="flex flex-col lg:flex-row gap-2" ref={containerRef}>
        <div className="relative flex-1 min-w-0">
          <label className="block text-xs font-medium text-gray-500 mb-1 px-1">
            Lokasi
          </label>
          <div className="relative">
            <Icon
              icon="mdi:map-marker-outline"
              width="20"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsLocationOpen(true);
                setValues((prev) => ({ ...prev, city_id: null }));
              }}
              onFocus={() => {
                if (hasSuggestions || query) setIsLocationOpen(true);
              }}
              placeholder="Kota, provinsi, atau negara"
              className={`w-full rounded-xl border bg-gray-50 pl-10 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.city_id ? "border-red-400" : "border-gray-200"
              }`}
            />
          </div>
          {errors.city_id && (
            <p className="text-xs text-red-600 mt-1 px-1">{errors.city_id}</p>
          )}

          {isLocationOpen && (
            <div className="absolute z-30 mt-1 w-full max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl">
              {loading ? (
                <div className="p-3 text-sm text-gray-500">
                  Mencari lokasi...
                </div>
              ) : hasSuggestions ? (
                <>
                  {suggestions.countries.length > 0 && (
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                      Negara
                    </div>
                  )}
                  {suggestions.countries.map((item) => (
                    <button
                      key={`country-${item.id}`}
                      type="button"
                      onClick={() => handleSelectCity(item)}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-blue-50 text-gray-700 transition"
                    >
                      {item.name}
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
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-blue-50 text-gray-700 transition"
                    >
                      {item.name}
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
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-blue-50 text-gray-700 transition"
                    >
                      {item.name}
                    </button>
                  ))}
                </>
              ) : query ? (
                <div className="p-3 text-sm text-gray-500">
                  Tidak ada lokasi ditemukan
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="relative flex items-end gap-2 flex-1">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1 px-1">
              Check-in
            </label>
            <button
              type="button"
              onClick={() => {
                setIsCalendarOpen(!isCalendarOpen);
                setIsGuestOpen(false);
              }}
              className={`w-full rounded-xl border bg-gray-50 px-3 py-3 text-sm text-left flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.check_in ? "border-red-400" : "border-gray-200"
              }`}
            >
              <Icon
                icon="mdi:calendar-outline"
                width="20"
                className="text-gray-400 shrink-0"
              />
              <span
                className={values.check_in ? "text-gray-800" : "text-gray-400"}
              >
                {values.check_in ? formatDate(values.check_in) : "Pilih tanggal"}
              </span>
            </button>
            {errors.check_in && (
              <p className="text-xs text-red-600 mt-1 px-1">{errors.check_in}</p>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1 px-1">
              Check-out
            </label>
            <button
              type="button"
              onClick={() => {
                setIsCalendarOpen(!isCalendarOpen);
                setIsGuestOpen(false);
              }}
              className={`w-full rounded-xl border bg-gray-50 px-3 py-3 text-sm text-left flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.check_out ? "border-red-400" : "border-gray-200"
              }`}
            >
              <Icon
                icon="mdi:calendar-outline"
                width="20"
                className="text-gray-400 shrink-0"
              />
              <span
                className={
                  values.check_out ? "text-gray-800" : "text-gray-400"
                }
              >
                {values.check_out
                  ? formatDate(values.check_out)
                  : "Pilih tanggal"}
              </span>
            </button>
            {errors.check_out && (
              <p className="text-xs text-red-600 mt-1 px-1">
                {errors.check_out}
              </p>
            )}
          </div>

          {isCalendarOpen && (
            <div className="absolute z-30 top-full mt-1 left-0">
              <Calendar
                key={values.check_in || todayStr}
                checkIn={values.check_in}
                checkOut={values.check_out}
                onSelect={handleCalendarSelect}
                minDate={todayStr}
              />
            </div>
          )}
        </div>

        <div className="relative flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1 px-1">
            Tamu & Kamar
          </label>
          <button
            type="button"
            onClick={() => {
              setIsGuestOpen(!isGuestOpen);
              setIsCalendarOpen(false);
            }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-left flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <Icon
              icon="mdi:account-outline"
              width="20"
              className="text-gray-400 shrink-0"
            />
            <span className="text-gray-800 truncate">
              {values.rooms} Kamar, {values.adults} Dewasa, {values.children}{" "}
              Anak
            </span>
          </button>

          {isGuestOpen && (
            <div className="absolute z-30 mt-1 right-0">
              <GuestSelector
                adults={values.adults}
                childCount={values.children}
                rooms={values.rooms}
                onChange={handleGuestChange}
              />
            </div>
          )}
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition shrink-0"
          >
            <Icon icon="mdi:magnify" width="20" />
            Cari Hotel
          </button>
        </div>
      </div>
    </form>
  );
};
