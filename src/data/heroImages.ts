/**
 * Maps each shop category / service id to the 3 photos uploaded to
 * /public/HeroSectionIMG/<folder>/ for that category. Used by the
 * homepage bento tiles (default-image → hover-clean-card) and by the
 * dark hero banners on the matching category/service pages.
 */
export const heroImages: Record<string, string[]> = {
  brand: [
    "/HeroSectionIMG/brand-my-business/business-set.jfif",
    "/HeroSectionIMG/brand-my-business/business-set2.jfif",
    "/HeroSectionIMG/brand-my-business/business-set3.jfif",
  ],
  events: [
    "/HeroSectionIMG/promote-events/promote-events.jfif",
    "/HeroSectionIMG/promote-events/promote-events2.jfif",
    "/HeroSectionIMG/promote-events/promote-events3.jfif",
  ],
  apparel: [
    "/HeroSectionIMG/Dress-my-team/DRT1.jfif",
    "/HeroSectionIMG/Dress-my-team/DRT2.jfif",
    "/HeroSectionIMG/Dress-my-team/DRT3.jfif",
  ],
  gifts: [
    "/HeroSectionIMG/corporate-gifts/corporate-gifts.jfif",
    "/HeroSectionIMG/corporate-gifts/corporate-gifts2.jfif",
    "/HeroSectionIMG/corporate-gifts/corporate-gifts3.jfif",
  ],
  packaging: [
    "/HeroSectionIMG/package/package-my-production.jpg",
    "/HeroSectionIMG/package/package-my-production2.jpg",
    "/HeroSectionIMG/package/package-my-production3.jpg",
  ],
  print: [
    "/HeroSectionIMG/frame/PF1.jfif",
    "/HeroSectionIMG/frame/PF2.jfif",
    "/HeroSectionIMG/frame/PF3.jfif",
  ],
  "graphic-design": [
    "/HeroSectionIMG/graphic-design/GD1.jfif",
    "/HeroSectionIMG/graphic-design/GD2.jfif",
    "/HeroSectionIMG/graphic-design/GD3.jpg",
  ],
  "web-design": [
    "/HeroSectionIMG/web-design/web-design1.jfif",
    "/HeroSectionIMG/web-design/web-design2.jpg",
    "/HeroSectionIMG/web-design/web-design3.jfif",
  ],
  signage: [
    "/HeroSectionIMG/signage/SN1.jfif",
    "/HeroSectionIMG/signage/SN2.jfif",
    "/HeroSectionIMG/signage/SN3.jfif",
  ],
};
