"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { activity as seedActivity, clients as seedClients, proposals as seedProposals } from "@/lib/mock-data";
import type { ActivityItem, Client, ClientInput, Proposal, ProposalInput, ProposalStatus } from "@/lib/types";

const storageKeys = {
  proposals: "proposalflow:proposals",
  clients: "proposalflow:clients",
  activity: "proposalflow:activity",
};

type FeedbackTone = "success" | "error";

interface Feedback {
  tone: FeedbackTone;
  message: string;
}

interface ProposalFlowContextValue {
  proposals: Proposal[];
  clients: Client[];
  activity: ActivityItem[];
  isHydrated: boolean;
  feedback: Feedback | null;
  addProposal: (input: ProposalInput) => Proposal;
  updateProposalStatus: (id: string, status: ProposalStatus) => void;
  deleteProposal: (id: string) => void;
  addClient: (input: ClientInput) => Client;
  clearFeedback: () => void;
}

const ProposalFlowContext = createContext<ProposalFlowContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Keep the UI usable if the browser blocks or fills localStorage.
  }
}

function nowLabel() {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

function activityItem(action: string, detail: string): ActivityItem {
  return {
    id: createId("ACT"),
    action,
    detail,
    time: "Just now",
  };
}

export function ProposalFlowProvider({ children }: { children: ReactNode }) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    setProposals(readStorage(storageKeys.proposals, seedProposals));
    setClients(readStorage(storageKeys.clients, seedClients));
    setActivity(readStorage(storageKeys.activity, seedActivity));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeStorage(storageKeys.proposals, proposals);
    writeStorage(storageKeys.clients, clients);
    writeStorage(storageKeys.activity, activity);
  }, [activity, clients, isHydrated, proposals]);

  const addActivity = useCallback((item: ActivityItem) => {
    setActivity((current) => [item, ...current].slice(0, 12));
  }, []);

  const addProposal = useCallback(
    (input: ProposalInput) => {
      const proposal: Proposal = {
        ...input,
        id: createId("PF"),
        updatedAt: nowLabel(),
        owner: "Maya Chen",
      };

      setProposals((current) => [proposal, ...current]);
      addActivity(activityItem("Proposal created", `${proposal.title} was created for ${proposal.client}.`));
      setFeedback({ tone: "success", message: "Proposal created and saved locally." });

      return proposal;
    },
    [addActivity],
  );

  const updateProposalStatus = useCallback(
    (id: string, status: ProposalStatus) => {
      const proposal = proposals.find((item) => item.id === id);

      setProposals((current) =>
        current.map((proposal) => {
          if (proposal.id !== id) {
            return proposal;
          }

          return {
            ...proposal,
            status,
            updatedAt: nowLabel(),
          };
        }),
      );

      addActivity(activityItem("Status updated", `${proposal?.title ?? "A proposal"} moved to ${status}.`));
      setFeedback({ tone: "success", message: "Proposal status updated." });
    },
    [addActivity, proposals],
  );

  const deleteProposal = useCallback(
    (id: string) => {
      const proposal = proposals.find((item) => item.id === id);

      setProposals((current) => current.filter((item) => item.id !== id));
      addActivity(activityItem("Proposal deleted", `${proposal?.title ?? "A proposal"} was removed.`));
      setFeedback({ tone: "success", message: "Proposal deleted." });
    },
    [addActivity, proposals],
  );

  const addClient = useCallback(
    (input: ClientInput) => {
      const client: Client = {
        ...input,
        id: createId("CL"),
        proposals: 0,
        totalValue: 0,
      };

      setClients((current) => [client, ...current]);
      addActivity(activityItem("Client added", `${client.company} was added to the workspace.`));
      setFeedback({ tone: "success", message: "Client added and saved locally." });

      return client;
    },
    [addActivity],
  );

  const clearFeedback = useCallback(() => setFeedback(null), []);

  const value = useMemo(
    () => ({
      proposals,
      clients,
      activity,
      isHydrated,
      feedback,
      addProposal,
      updateProposalStatus,
      deleteProposal,
      addClient,
      clearFeedback,
    }),
    [
      activity,
      addClient,
      addProposal,
      clearFeedback,
      clients,
      deleteProposal,
      feedback,
      isHydrated,
      proposals,
      updateProposalStatus,
    ],
  );

  return <ProposalFlowContext.Provider value={value}>{children}</ProposalFlowContext.Provider>;
}

export function useProposalFlow() {
  const context = useContext(ProposalFlowContext);

  if (!context) {
    throw new Error("useProposalFlow must be used within ProposalFlowProvider");
  }

  return context;
}
