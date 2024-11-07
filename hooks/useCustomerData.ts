"use client";
import { supabase } from "@/lib/supabase";
import { DataType } from "@/types";
import { useEffect, useState } from "react";

type UseFetchVerificationApplicantsFlaggedProps = {
  query?: string;
};

export const useFetchVerificationApplicantsFlagged = ({
  query,
}: UseFetchVerificationApplicantsFlaggedProps) => {
  const [applicants, setApplicants] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      setError(null);

      try {
        if (query) {
          const { data, error } = await supabase
            .from("verification_applicants")
            .select("*")
            .eq("verificationStatus", query);
          if (error) throw error;

          setApplicants(data || []);
        } else {
          const { data, error } = await supabase
            .from("verification_applicants")
            .select("*");
          if (error) throw error;

          setApplicants(data || []);
        }
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
