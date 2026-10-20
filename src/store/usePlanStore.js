import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const EXAMPLE_PLAN = {
  orgName: 'Acme Financial Services',
  sector: 'Financial Services',
  primaryFunction: 'Technology',
  functions: ['Technology', 'Finance & Accounting', 'Analytics & Data'],
  year1Headcount: 75,
  year3Target: 250,
  seniorityMix: { junior: 35, mid: 45, senior: 20 },
  weights: { talent: 5, cost: 4, rent: 3, ecosystem: 4, readiness: 3 },
  preferredStates: [],
  notes: 'Prefer cities with at least 10 existing GCCs in financial services.',
  isExample: true,
}

const DEFAULT_STATE = {
  currentStep: 0,
  isExample: false,
  orgName: '',
  sector: '',
  primaryFunction: '',
  functions: [],
  year1Headcount: 50,
  year3Target: 150,
  seniorityMix: { junior: 30, mid: 50, senior: 20 },
  weights: { talent: 3, cost: 3, rent: 2, ecosystem: 3, readiness: 2 },
  preferredStates: [],
  notes: '',
  shortlisted: [],
  compareList: [],
}

const usePlanStore = create(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      // ── Wizard navigation ──────────────────────────────────────────────────
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 5) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

      // ── Field updates ──────────────────────────────────────────────────────
      setContext: (data) => set(data),
      setFunctions: (functions) => set({ functions }),
      setHeadcount: (data) => set(data),
      setWeights: (patch) => set((s) => ({ weights: { ...s.weights, ...patch } })),
      setConstraints: (data) => set(data),

      // ── Plan actions ───────────────────────────────────────────────────────
      loadExample: () => set({ ...EXAMPLE_PLAN, currentStep: 5, isExample: true }),
      resetPlan: () => set({ ...DEFAULT_STATE }),
      loadFromData: (data) => set({ ...data, isExample: false, currentStep: 5 }),

      // ── Shortlist ──────────────────────────────────────────────────────────
      toggleShortlist: (id) =>
        set((s) => ({
          shortlisted: s.shortlisted.includes(id)
            ? s.shortlisted.filter((x) => x !== id)
            : [...s.shortlisted, id],
        })),

      // ── Compare list (max 5) ───────────────────────────────────────────────
      toggleCompare: (id) =>
        set((s) => {
          if (s.compareList.includes(id))
            return { compareList: s.compareList.filter((x) => x !== id) }
          if (s.compareList.length >= 5) return {}
          return { compareList: [...s.compareList, id] }
        }),
      clearCompare: () => set({ compareList: [] }),

      // ── Selectors ─────────────────────────────────────────────────────────
      getPlan: () => {
        const s = get()
        return {
          orgName: s.orgName,
          sector: s.sector,
          primaryFunction: s.primaryFunction,
          functions: s.functions,
          year1Headcount: s.year1Headcount,
          year3Target: s.year3Target,
          seniorityMix: s.seniorityMix,
          weights: s.weights,
          preferredStates: s.preferredStates,
          notes: s.notes,
        }
      },

      isPlanReady: () => {
        const s = get()
        return !!(s.orgName || s.functions.length)
      },
    }),
    {
      name: 'gcc-atlas-plan-v1',
      partialize: (s) => ({
        orgName: s.orgName,
        sector: s.sector,
        primaryFunction: s.primaryFunction,
        functions: s.functions,
        year1Headcount: s.year1Headcount,
        year3Target: s.year3Target,
        seniorityMix: s.seniorityMix,
        weights: s.weights,
        preferredStates: s.preferredStates,
        notes: s.notes,
        shortlisted: s.shortlisted,
        compareList: s.compareList,
        currentStep: s.currentStep,
      }),
    }
  )
)

export default usePlanStore
