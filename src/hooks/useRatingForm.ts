import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { impairmentCodes } from '../data/impairmentCodes';
import { underwriters } from '../data/underwriters';
import { CaseRecord, RatingValues } from '../types/case';
import { nearestAge, parseUSDate } from '../utils/date';
import { calculateRating, RatingResult } from '../utils/rating';

type RatingErrors = Partial<Record<'dateEvaluated' | 'mult' | 'responseDate' | 'expirationDate' | 'calc', string>>;

export function useRatingForm(c: CaseRecord | undefined) {
  const navigate = useNavigate();
  const { saveRating, setCaseStatus } = useWorkspace();
  const r = c?.rating ?? null;
  const dobDate = c ? parseUSDate(c.dob) : null;
  const age = r?.age ?? (dobDate ? nearestAge(dobDate) : 0);

  const [dateEvaluated, setDateEvaluated] = useState(r?.dateEvaluated ?? '04/01/2026');
  const [multMethod, setMultMethod] = useState(r?.multMethod ?? 'AT');
  const [mult, setMult] = useState(String(r?.mult ?? 100));
  const [underwriter, setUnderwriter] = useState(r?.underwriter ?? underwriters[1]);
  const [results, setResults] = useState<RatingResult | null>(
    r ? { normalLE: r.normalLE, normalLE75: r.normalLE75, estimatedLE: r.estimatedLE, ratedAge: r.calculatedRatedAge } : null
  );
  const [finalRatedAge, setFinalRatedAge] = useState<number | null>(r?.finalRatedAge ?? null);
  const [responseDate, setResponseDate] = useState(r?.responseDate ?? '04/01/2026');
  const [expirationDate, setExpirationDate] = useState(r?.expirationDate ?? '04/01/2027');
  const [primaryCode, setPrimaryCode] = useState(r?.primaryImpairmentCode ?? impairmentCodes[0].code);
  const [secondaryCodes, setSecondaryCodes] = useState<string[]>(r?.secondaryImpairmentCodes ?? []);
  const [note, setNote] = useState<string[]>(r?.note ?? []);
  const [errors, setErrors] = useState<RatingErrors>({});
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState<'save' | 'note' | null>(null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const clearError = (key: keyof RatingErrors) => setErrors((e) => ({ ...e, [key]: undefined }));

  const calculate = () => {
    if (!c) return;
    const m = Number(mult);
    const next: RatingErrors = {};
    if (!parseUSDate(dateEvaluated)) next.dateEvaluated = 'Use the format MM/DD/YYYY.';
    if (!mult.trim() || Number.isNaN(m) || m < 25 || m > 1000) next.mult = 'Enter a multiplier between 25 and 1000.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setCalculating(true);
    timer.current = window.setTimeout(() => {
      const res = calculateRating(age, c.gender, m);
      setResults(res);
      setFinalRatedAge(res.ratedAge);
      setCalculating(false);
      toast.success(`Rated age calculated: ${res.ratedAge}`, { description: `Normal L.E. ${res.normalLE.toFixed(2)} · Estimated L.E. ${res.estimatedLE.toFixed(2)}` });
    }, 700);
  };

  const adjustFinal = (delta: number) => setFinalRatedAge((f) => f === null ? f : Math.max(age, Math.min(100, f + delta)));

  const buildValues = (): RatingValues | null => {
    if (!results || finalRatedAge === null) return null;
    return {
      dateEvaluated,
      multMethod,
      mult: Number(mult),
      age,
      normalLE: results.normalLE,
      normalLE75: results.normalLE75,
      estimatedLE: results.estimatedLE,
      calculatedRatedAge: results.ratedAge,
      finalRatedAge,
      responseDate,
      expirationDate,
      underwriter,
      primaryImpairmentCode: primaryCode,
      secondaryImpairmentCodes: secondaryCodes,
      note
    };
  };

  const save = () => {
    if (!c || saving) return;
    const next: RatingErrors = {};
    if (!parseUSDate(dateEvaluated)) next.dateEvaluated = 'Use the format MM/DD/YYYY.';
    if (!parseUSDate(responseDate)) next.responseDate = 'Use the format MM/DD/YYYY.';
    if (!parseUSDate(expirationDate)) next.expirationDate = 'Use the format MM/DD/YYYY.';
    if (!results) next.calc = 'Calculate the rated age before saving.';
    setErrors(next);
    const values = buildValues();
    if (Object.keys(next).length || !values) return;
    setSaving('save');
    timer.current = window.setTimeout(() => {
      saveRating(c.caseNumber, values);
      setCaseStatus(c.caseNumber, 'Rated*');
      setSaving(null);
      toast.success('Rating activity saved', { description: `${c.claimantName} · Final Rated Age ${values.finalRatedAge}` });
      navigate(`/case/${c.caseNumber}/rating`);
    }, 700);
  };

  const saveNote = () => {
    if (!c || saving) return;
    setSaving('note');
    timer.current = window.setTimeout(() => {
      if (r) saveRating(c.caseNumber, { ...r, note });
      setSaving(null);
      toast.success('Underwriter note saved');
    }, 500);
  };

  return {
    age,
    fields: { dateEvaluated, multMethod, mult, underwriter, responseDate, expirationDate, primaryCode, secondaryCodes, note },
    setters: { setDateEvaluated, setMultMethod, setMult, setUnderwriter, setResponseDate, setExpirationDate, setPrimaryCode, setSecondaryCodes, setNote },
    results,
    finalRatedAge,
    adjustFinal,
    errors,
    clearError,
    calculating,
    saving,
    calculate,
    save,
    saveNote
  };
}