"use client"
import { supabase } from '@/lib/supabase';
import { DataType } from '@/types';
import { useEffect, useState } from 'react';


export const useFetchVerificationApplicantsFlagged = () => {
  const [applicants, setApplicants] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('verification_applicants')
          .select('*');
// .eq("verificationStatus","flagged")

        if (error) throw error;

        setApplicants(data || []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  return { applicants, loading, error };
};
