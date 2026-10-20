import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

/** Fetch all detail data for a single location by slug or id. */
export function useLocationDetail(slugOrId) {
  return useQuery({
    queryKey: ['location-detail', slugOrId],
    queryFn: async () => {
      // Fetch location
      const { data: locRows, error: locErr } = await supabase
        .from('locations')
        .select('*')
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .limit(1)

      if (locErr || !locRows?.length) throw new Error('Location not found')
      const loc = locRows[0]
      const lid = loc.id

      const [
        { data: metrics = [] },
        { data: salaries = [] },
        { data: costs = [] },
        { data: incentives = [] },
        { data: gccRec = [] },
        { data: providerLocs = [] },
        { data: candidates = [] },
        { data: approvals = [] },
      ] = await Promise.all([
        supabase.from('location_metrics').select('*, source:sources(*)').eq('location_id', lid),
        supabase.from('salary_benchmarks').select('*, source:sources(*)').eq('location_id', lid).order('seniority'),
        supabase.from('location_cost_components').select('*, source:sources(*)').eq('location_id', lid),
        supabase.from('incentives').select('*, source:sources(*)').eq('location_id', lid),
        supabase.from('gcc_records').select('*').eq('location_id', lid).order('opened_on', { ascending: false }),
        supabase.from('provider_locations').select('provider:providers(*)').eq('location_id', lid),
        supabase.from('location_candidate_evidence').select('*, source:sources(*)').eq('location_id', lid),
        supabase.from('approval_requirements').select('*').or(`jurisdiction.eq.${loc.state},jurisdiction.eq.India`),
      ])

      const providers = providerLocs.map((pl) => pl.provider).filter(Boolean)

      return {
        location: loc,
        metrics,
        salaries,
        costs,
        incentives,
        gccRecords: gccRec,
        providers,
        candidates,
        approvals,
      }
    },
    enabled: !!slugOrId,
    staleTime: 5 * 60 * 1000,
  })
}
