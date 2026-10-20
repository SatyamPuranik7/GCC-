import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { buildDataMaps, scoreLocations } from '../lib/scoring'

/** Fetch all data needed to score and rank all 45 locations. */
export function useAtlasData(weights) {
  return useQuery({
    queryKey: ['atlas-data', weights],
    queryFn: async () => {
      const [
        { data: locations = [] },
        { data: metrics = [] },
        { data: salaries = [] },
        { data: costs = [] },
        { data: records = [] },
        { data: incentives = [] },
        { data: providerLocs = [] },
        { data: sources = [] },
        { data: candidateEvidence = [] },
      ] = await Promise.all([
        supabase.from('locations').select('*').order('city'),
        supabase.from('location_metrics').select('*, source:sources(*)'),
        supabase.from('salary_benchmarks').select('*, source:sources(*)'),
        supabase.from('location_cost_components').select('*, source:sources(*)'),
        supabase.from('gcc_records').select('id, location_id, company_name'),
        supabase.from('incentives').select('*'),
        supabase.from('provider_locations').select('*'),
        supabase.from('sources').select('*'),
        supabase.from('location_candidate_evidence').select('*, source:sources(*)'),
      ])

      const dataContext = buildDataMaps(
        metrics,
        salaries,
        costs,
        records,
        incentives,
        providerLocs,
        candidateEvidence
      )

      const scored = scoreLocations(locations, dataContext, weights)

      return {
        locations,
        scored,
        metrics,
        salaries,
        costs,
        records,
        incentives,
        sources,
        candidateEvidence,
        dataContext,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

/** Lightweight hook — only locations list. */
export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('city')
      if (error) throw error
      return data ?? []
    },
    staleTime: 10 * 60 * 1000,
  })
}
