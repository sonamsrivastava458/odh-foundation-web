import type { CollectionConfig } from 'payload'
import { isEditor, readPublished } from '../access'
import { slugField } from '../fields/slug'
import { seoField } from '../fields/seo'

import { Hero } from '../blocks/Hero'
import { StatsBar } from '../blocks/StatsBar'
import { AboutStrip } from '../blocks/AboutStrip'
import { HowYouCanHelp } from '../blocks/HowYouCanHelp'
import { CategoryGrid } from '../blocks/CategoryGrid'
import { FeaturedProjects } from '../blocks/FeaturedProjects'
import { FeaturedCampaigns } from '../blocks/FeaturedCampaigns'
import { TestimonialCarousel } from '../blocks/TestimonialCarousel'
import { MediaGrid } from '../blocks/MediaGrid'
import { TrustStrip } from '../blocks/TrustStrip'
import { CTABand } from '../blocks/CTABand'
import { PageHeader } from '../blocks/PageHeader'
import { RichText } from '../blocks/RichText'
import { TeamGrid } from '../blocks/TeamGrid'
import { Timeline } from '../blocks/Timeline'
import { FAQAccordion } from '../blocks/FAQAccordion'
import { FormBlock } from '../blocks/FormBlock'
import { ImageGallery } from '../blocks/ImageGallery'
import { VideoEmbed } from '../blocks/VideoEmbed'
import { MapContact } from '../blocks/MapContact'
import { FeatureCards } from '../blocks/FeatureCards'
import { HomeIntroSection } from '../blocks/HomeIntroSection'
import { WhyODHFoundation } from '../blocks/WhyODHFoundation'
import { OurCauses } from '../blocks/OurCauses'
import { VolunteerCTA } from '../blocks/VolunteerCTA'
import { AboutIntroSection } from '../blocks/AboutIntroSection'
import { VisionMission } from '../blocks/VisionMission'
import { FinalCtaBanner } from '../blocks/FinalCtaBanner'
import { EventsAndCausesSection } from '../blocks/EventsAndCausesSection'
import { ContactInformation } from '../blocks/ContactInformation'
import {FAQContactCTA} from "../blocks/FAQContactCTA";
import {DonationLayout} from "../blocks/DonationLayout";
import {LoginForm} from "../blocks/LoginForm";



import { populateBlocks } from '../hooks/populateBlocks'
import { clearHiddenFormFields } from '../hooks/clearHiddenFormFields'



export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: readPublished,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  hooks: {
    // Reference blocks (featuredProjects, categoryGrid, …) ka data collections se
    // laakar block.items me bhar deta hai
    afterRead: [populateBlocks],
    beforeChange: [clearHiddenFormFields],
  },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      name: 'layout',
      type: 'blocks',
      minRows: 1,
      blocks: [
        Hero,
        PageHeader,
        StatsBar,
        AboutStrip,
        CategoryGrid,
        FeaturedCampaigns,
        FeaturedProjects,
        HowYouCanHelp,
        TestimonialCarousel,
        MediaGrid,
        TrustStrip,
        CTABand,
        RichText,
        TeamGrid,
        Timeline,
        FAQAccordion,
        FormBlock,
        ImageGallery,
        VideoEmbed,
        MapContact,
        FeatureCards,
        HomeIntroSection,
        WhyODHFoundation,
        OurCauses,
        VolunteerCTA,
        AboutIntroSection,
        VisionMission,
        FinalCtaBanner,
        EventsAndCausesSection,
        ContactInformation,
        FAQContactCTA,
        DonationLayout,
        LoginForm,
      ],

    },
    seoField(),
  ],
}
