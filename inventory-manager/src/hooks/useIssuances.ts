import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIssuances, getIssuanceById, createIssuance } from "../services/endpoints/issuance.services";
import type { IssuanceDTO, IssuanceListResponse, IssuanceUI, CreateIssuanceRequest } from "../types/issuances.types";

const normalize = (data: any[]): IssuanceUI[] => 
    data.map((i) => ({
        id: i.id,
        recipientName: i.recipientName,
        issuedByUserName: i.issuedByUserName,
        issuedAt: i.issuedAt,
        totalItems: i.totalItems
    }));


export const useIssuances = (page: number, pageSize: number, search: string) => {
    const queryClient = useQueryClient();

    // GET ALL
    const issuancesQuery = useQuery<IssuanceListResponse>({
        queryKey: ["issuances", page, pageSize, search],
        queryFn: () => getIssuances(page, pageSize, search),
    });

    // GET BY ID
    const fetchIssuanceById = async (id: string): Promise<IssuanceDTO> => {
        const res = await getIssuanceById(id);
        return res;
    };

    const addIssuanceMutation = useMutation({
        mutationFn: (data: CreateIssuanceRequest) => createIssuance(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["issuances"]});
        },
    });

    return {
        issuances: normalize(issuancesQuery.data?.data ?? []),
        totalItems: issuancesQuery.data?.totalCount ?? 0,
        loading: issuancesQuery.isLoading,
        
        fetchIssuanceById,

        addIsuance: addIssuanceMutation.mutateAsync,
    };
};