export type WorkoutResourceLink = {
  url: string;
  source: string;
  thumbnailUrl: string;
};

const BEBE_SOURCE = "BEBE (@bebetanchanokrith)";
const ytThumb = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export const THAI_WORKOUT_LINKS: Record<string, WorkoutResourceLink> = {
  easy1: {
    url: "https://www.youtube.com/watch?v=p2_EfQe2NLc",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("p2_EfQe2NLc"),
  },
  easy2: {
    url: "https://www.youtube.com/watch?v=fcg0TIpG37A",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("fcg0TIpG37A"),
  },
  easy3: {
    url: "https://www.youtube.com/watch?v=LGN8SouVWLs",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("LGN8SouVWLs"),
  },
  easy4: {
    url: "https://www.youtube.com/watch?v=Ufxi-XIxAJk",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("Ufxi-XIxAJk"),
  },
  easy5: {
    url: "https://www.youtube.com/watch?v=hXpUos_QUtE",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("hXpUos_QUtE"),
  },
  medium1: {
    url: "https://www.youtube.com/watch?v=TtDSrdzih-w",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("TtDSrdzih-w"),
  },
  medium2: {
    url: "https://www.youtube.com/watch?v=YUCLMiq-pXY",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("YUCLMiq-pXY"),
  },
  medium3: {
    url: "https://www.youtube.com/watch?v=IMuYJAQ5GMk",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("IMuYJAQ5GMk"),
  },
  medium4: {
    url: "https://www.youtube.com/watch?v=2_aeIBN5AHA",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("2_aeIBN5AHA"),
  },
  medium5: {
    url: "https://www.youtube.com/watch?v=V9GoUMtrOOQ",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("V9GoUMtrOOQ"),
  },
  hard1: {
    url: "https://www.youtube.com/watch?v=ufbSNW_qxsM",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("ufbSNW_qxsM"),
  },
  hard2: {
    url: "https://www.youtube.com/watch?v=N7hc7FDPO9A",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("N7hc7FDPO9A"),
  },
  hard3: {
    url: "https://www.youtube.com/watch?v=4eia7LtqmmQ",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("4eia7LtqmmQ"),
  },
  hard4: {
    url: "https://www.youtube.com/watch?v=v4wCERDLzbc",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("v4wCERDLzbc"),
  },
  hard5: {
    url: "https://www.youtube.com/watch?v=q1Sv3tn_3Eo",
    source: BEBE_SOURCE,
    thumbnailUrl: ytThumb("q1Sv3tn_3Eo"),
  },
};
