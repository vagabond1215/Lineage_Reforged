import type {
  AccountProfileState,
  CampaignPublicationConsumerKind,
  CampaignPublicationConsumerReceiptState
} from "../../../shared/types/src/index.js";

export interface VerifiedCampaignPublication {
  publicationId: string;
  campaignId: string;
  continuityId: string;
  characterId: string;
  publishedAt: string;
}

export function buildPublicationConsumerId(
  publicationId: string,
  kind: CampaignPublicationConsumerKind
): string {
  return `${publicationId}.consumer.${kind}`;
}

export function findPublicationConsumerReceipt(
  profile: AccountProfileState,
  publicationId: string,
  kind: CampaignPublicationConsumerKind
): CampaignPublicationConsumerReceiptState | null {
  const consumerId = buildPublicationConsumerId(publicationId, kind);
  return (
    (profile.campaignPublicationReceipts ?? []).find(
      (receipt) => receipt.consumerId === consumerId
    ) ?? null
  );
}

export function recordCampaignPublicationConsumer(
  profile: AccountProfileState,
  publication: VerifiedCampaignPublication,
  kind: CampaignPublicationConsumerKind,
  payloadFingerprint: string,
  params: {
    status: "pending" | "applied";
    error?: string;
  }
): AccountProfileState {
  const consumerId = buildPublicationConsumerId(
    publication.publicationId,
    kind
  );
  const existing = findPublicationConsumerReceipt(
    profile,
    publication.publicationId,
    kind
  );

  if (existing && existing.payloadFingerprint !== payloadFingerprint) {
    throw new Error(
      `Campaign consumer '${consumerId}' was reused with conflicting payload.`
    );
  }

  if (existing?.status === "applied") {
    return profile;
  }

  const receipt: CampaignPublicationConsumerReceiptState = {
    consumerId,
    publicationId: publication.publicationId,
    campaignId: publication.campaignId,
    continuityId: publication.continuityId,
    characterId: publication.characterId,
    kind,
    payloadFingerprint,
    status: params.status,
    createdAt: existing?.createdAt ?? publication.publishedAt,
    ...(params.status === "applied"
      ? { appliedAt: publication.publishedAt }
      : {}),
    ...(params.error ? { lastError: params.error } : {})
  };

  return {
    ...profile,
    campaignPublicationReceipts: [
      ...(profile.campaignPublicationReceipts ?? []).filter(
        (entry) => entry.consumerId !== consumerId
      ),
      receipt
    ]
  };
}

export function hasPendingMandatoryCampaignConsumers(
  profile: AccountProfileState
): boolean {
  return (profile.campaignPublicationReceipts ?? []).some(
    (receipt) =>
      receipt.status === "pending" &&
      (receipt.kind === "preparation_consumption" ||
        receipt.kind === "inheritance_consumption" ||
        receipt.kind === "retirement_settlement")
  );
}
