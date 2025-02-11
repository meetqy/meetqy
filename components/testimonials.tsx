import React from "react";
import Container from "@/components/global/container";

const testimonials = [
  {
    pfp: "https://randomuser.me/api/portraits/women/46.jpg",
    fullName: "Sarah Johnson",
    jobTitle: "International Student",
    review:
      "Thanks to this service, I now have a beautiful Chinese name 李明月. The detailed explanation of each character's meaning helped me understand the cultural significance behind my name.",
  },
  {
    pfp: "https://randomuser.me/api/portraits/men/44.jpg",
    fullName: "Michael Chen",
    jobTitle: "Business Executive",
    review:
      "As a Chinese American, I wanted a proper Chinese name for business in China. The AI suggested 陈志远, which perfectly bridges my Western and Eastern identities.",
  },
  {
    pfp: "https://randomuser.me/api/portraits/women/29.jpg",
    fullName: "Emily Rodriguez",
    jobTitle: "Language Teacher",
    review:
      "The cultural context provided with my Chinese name 柔雅 was invaluable. My students in China can now easily pronounce and remember my name, which has strengthened our connection.",
  },
  {
    pfp: "https://randomuser.me/api/portraits/men/62.jpg",
    fullName: "David Wilson",
    jobTitle: "Exchange Professor",
    review:
      "The process of getting my Chinese name 威德明 was fascinating. The AI considered my profession, personality, and even my life philosophy to create a meaningful name.",
  },
  {
    pfp: "https://randomuser.me/api/portraits/women/45.jpg",
    fullName: "Lisa Thompson",
    jobTitle: "Cultural Consultant",
    review:
      "I needed a Chinese name that would resonate in professional settings. 汤丽莎 not only sounds natural but also carries the elegant meaning I was hoping for.",
  },
  {
    pfp: "https://randomuser.me/api/portraits/men/91.jpg",
    fullName: "James Anderson",
    jobTitle: "Digital Nomad",
    review:
      "Getting a proper Chinese name was crucial for my long-term stay in China. 安杰明 feels authentic and has made local interactions much more personal and meaningful.",
  },
  {
    pfp: "https://randomuser.me/api/portraits/women/31.jpg",
    fullName: "Anna Martinez",
    jobTitle: "Study Abroad Student",
    review:
      "The AI suggested 马安娜 for me, explaining how it maintains the sound of my original name while following Chinese naming conventions. I absolutely love it!",
  },
];

const Testimonials = () => {
  // 将评价分成三列
  const columns = [
    testimonials.slice(0, 2),
    testimonials.slice(2, 5),
    testimonials.slice(5, 7),
  ];

  return (
    <Container id="testimonials" className={"max-w-5xl"}>
      <h2 className="mb-14 px-5 text-center text-2xl font-heading md:text-3xl lg:mb-20 lg:text-4xl text-zinc-900 dark:text-darkText/90">
        What Our Clients Are Saying
      </h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
        {columns.map((column, index) => (
          <div className="group flex flex-col justify-center" key={index}>
            {column.map(({ jobTitle, pfp, fullName, review }, index) => (
              <div
                className="relative border-[3px] border-zinc-900 dark:border-darkText/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(248,244,221,0.3)]
                mb-4 min-h-48 w-full rounded-xl bg-white dark:bg-secondaryBlack p-5 lg:mb-8
                hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
                key={index}
              >
                <div className="flex items-center gap-5">
                  <img
                    className="h-12 w-12 rounded-xl border-[3px] border-zinc-900 dark:border-darkText/60"
                    src={pfp}
                    alt={`${fullName}'s profile picture`}
                  />

                  <div>
                    <h4 className="text-lg font-heading font-bold text-zinc-900 dark:text-darkText/90">
                      {fullName}
                    </h4>
                    <p className="text-sm font-medium text-zinc-700 dark:text-darkTextSecondary/80">
                      {jobTitle}
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="text-zinc-800 dark:text-darkTextSecondary/80">
                    {review}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Testimonials;
