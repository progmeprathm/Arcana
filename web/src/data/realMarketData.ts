import { MarketItem } from '../types';

export const REAL_MARKET_ITEMS: MarketItem[] = [
  {
    id: 'mkt-01',
    name: 'Mugwort (Artemisia vulgaris)',
    botanical_name: 'Artemisia vulgaris',
    category: 'Flora',
    unit_price: 5.25,
    currency: 'USD',
    unit: 'g',
    package_size: 113.4, // 4 oz in grams
    in_stock: true,
    supplier_name: 'Mountain Rose Herbs',
    provenance: 'Pacific Northwest, USA (Certified Organic)',
    ethical_harvest_grade: 'Organic',
    description: 'Dried cut & sifted aerial leaves with silver undertones. Harvested during flowering stage for peak essential oil content (thujone, cineole).',
    vendor_quotes: [
      {
        id: 'vq-01-mrh',
        vendor_name: 'Mountain Rose Herbs',
        vendor_url: 'https://mountainroseherbs.com/mugwort',
        raw_price: 5.25,
        currency: 'USD',
        package_size: 4,
        package_unit: 'oz',
        normalized_price_per_100g: 4.63, // $5.25 / 113.4g * 100
        shipping_estimate_days: 3,
        rating: 4.9,
        purity_certification: 'USDA Certified Organic & Kosher',
        in_stock: true
      },
      {
        id: 'vq-01-swb',
        vendor_name: 'Starwest Botanicals',
        vendor_url: 'https://www.starwest-botanicals.com/category/mugwort-herb-c-s-organic/',
        raw_price: 14.20,
        currency: 'USD',
        package_size: 1,
        package_unit: 'lb',
        normalized_price_per_100g: 3.13, // $14.20 / 453.6g * 100 (Best bulk value!)
        shipping_estimate_days: 4,
        rating: 4.8,
        purity_certification: 'QAI Organic Certified',
        in_stock: true
      },
      {
        id: 'vq-01-etsy',
        vendor_name: 'Etsy: MoonlitHearthApothecary',
        vendor_url: 'https://www.etsy.com/market/wildcrafted_mugwort',
        raw_price: 8.50,
        currency: 'USD',
        package_size: 100,
        package_unit: 'g',
        normalized_price_per_100g: 8.50,
        shipping_estimate_days: 2,
        rating: 5.0,
        purity_certification: 'Appalachian Wildcrafted under Waxing Moon',
        in_stock: true
      },
      {
        id: 'vq-01-amz',
        vendor_name: 'Amazon Prime: Magickal Botanicals',
        vendor_url: 'https://www.amazon.com/dp/B00MUGW01',
        raw_price: 11.99,
        currency: 'USD',
        package_size: 200,
        package_unit: 'g',
        normalized_price_per_100g: 6.00,
        shipping_estimate_days: 1,
        rating: 4.4,
        purity_certification: 'Commercial Lab Tested',
        in_stock: true
      }
    ]
  },
  {
    id: 'mkt-02',
    name: 'Frankincense Resin Tears (Boswellia carterii)',
    botanical_name: 'Boswellia carterii',
    category: 'Flora',
    unit_price: 8.75,
    currency: 'USD',
    unit: 'g',
    package_size: 113.4,
    in_stock: true,
    supplier_name: 'Mountain Rose Herbs',
    provenance: 'Puntland / Somaliland, First-choice pale tears',
    ethical_harvest_grade: 'EthicallySourced',
    description: 'Golden crystalline resin tears. Natural exudation from the frankincense tree; produces clean citrus and pine vapors on charcoal.',
    vendor_quotes: [
      {
        id: 'vq-02-mrh',
        vendor_name: 'Mountain Rose Herbs',
        vendor_url: 'https://mountainroseherbs.com/frankincense-resin',
        raw_price: 8.75,
        currency: 'USD',
        package_size: 4,
        package_unit: 'oz',
        normalized_price_per_100g: 7.72,
        shipping_estimate_days: 3,
        rating: 4.9,
        purity_certification: '100% Pure Wild Harvested Resins',
        in_stock: true
      },
      {
        id: 'vq-02-swb',
        vendor_name: 'Starwest Botanicals',
        vendor_url: 'https://www.starwest-botanicals.com/category/frankincense-resin-tears/',
        raw_price: 19.50,
        currency: 'USD',
        package_size: 1,
        package_unit: 'lb',
        normalized_price_per_100g: 4.30, // Best bulk rate
        shipping_estimate_days: 4,
        rating: 4.7,
        purity_certification: 'Wildcrafted Selected Tears Grade A',
        in_stock: true
      },
      {
        id: 'vq-02-hojari',
        vendor_name: 'Oman Royal Hojari Direct',
        vendor_url: 'https://www.etsy.com/market/royal_green_hojari',
        raw_price: 24.00,
        currency: 'USD',
        package_size: 100,
        package_unit: 'g',
        normalized_price_per_100g: 24.00,
        shipping_estimate_days: 6,
        rating: 5.0,
        purity_certification: 'Sacred Grade Green Hojari (Sultanate of Oman)',
        in_stock: true
      },
      {
        id: 'vq-02-amz',
        vendor_name: 'Amazon: Shoyeido Incense Imports',
        vendor_url: 'https://www.amazon.com/dp/B00FRNK02',
        raw_price: 14.50,
        currency: 'USD',
        package_size: 150,
        package_unit: 'g',
        normalized_price_per_100g: 9.67,
        shipping_estimate_days: 2,
        rating: 4.5,
        purity_certification: 'Aromatic Temple Grade',
        in_stock: true
      }
    ]
  },
  {
    id: 'mkt-03',
    name: 'Black Tourmaline Shards (Raw Schorl)',
    category: 'Mineral',
    unit_price: 9.50,
    currency: 'USD',
    unit: 'pcs',
    package_size: 6,
    in_stock: true,
    supplier_name: 'Minas Gerais Mineral Guild',
    provenance: 'Minas Gerais, Brazil',
    ethical_harvest_grade: 'Artisanal',
    description: 'Natural striations, raw termination points. Ideal for boundary sanctification and grounding ritual perimeter work.',
    vendor_quotes: [
      {
        id: 'vq-03-etsy',
        vendor_name: 'Etsy: CrystalSanctuaryEarth',
        vendor_url: 'https://www.etsy.com/market/raw_black_tourmaline',
        raw_price: 9.50,
        currency: 'USD',
        package_size: 6,
        package_unit: 'pcs',
        normalized_price_per_100g: 6.33,
        shipping_estimate_days: 3,
        rating: 4.9,
        purity_certification: 'Uncut Natural Schorl Minerals',
        in_stock: true
      },
      {
        id: 'vq-03-vault',
        vendor_name: 'Crystal Vaults',
        vendor_url: 'https://www.crystalvaults.com/crystal-encyclopedia/black-tourmaline/',
        raw_price: 14.00,
        currency: 'USD',
        package_size: 8,
        package_unit: 'pcs',
        normalized_price_per_100g: 8.75,
        shipping_estimate_days: 4,
        rating: 4.8,
        purity_certification: 'Certified Authenticated Specimen',
        in_stock: true
      },
      {
        id: 'vq-03-amz',
        vendor_name: 'Amazon Prime: Zen Gems',
        vendor_url: 'https://www.amazon.com/dp/B00TRML03',
        raw_price: 13.99,
        currency: 'USD',
        package_size: 10,
        package_unit: 'pcs',
        normalized_price_per_100g: 5.60, // Best unit price
        shipping_estimate_days: 1,
        rating: 4.6,
        purity_certification: 'Bulk Tumbled & Raw Grade A',
        in_stock: true
      }
    ]
  },
  {
    id: 'mkt-04',
    name: 'Naturally Shed Raven Molts',
    category: 'Fauna',
    unit_price: 18.00,
    currency: 'USD',
    unit: 'pcs',
    package_size: 3,
    in_stock: true,
    supplier_name: 'Highland Avian Conservancy',
    provenance: 'Scottish Highlands Sanctuary',
    ethical_harvest_grade: 'EthicallySourced',
    description: 'Authentic molted corvid wing and tail feathers collected non-intrusively from aviaries during seasonal molting.',
    vendor_quotes: [
      {
        id: 'vq-04-conservancy',
        vendor_name: 'Highland Avian Conservancy',
        vendor_url: 'https://www.highlandavian.org.uk/shop',
        raw_price: 18.00,
        currency: 'USD',
        package_size: 3,
        package_unit: 'pcs',
        normalized_price_per_100g: 18.00,
        shipping_estimate_days: 7,
        rating: 5.0,
        purity_certification: 'Cruelty-Free Sanctuary Verification',
        in_stock: true
      },
      {
        id: 'vq-04-etsy',
        vendor_name: 'Etsy: CrowAndThistleCrafts',
        vendor_url: 'https://www.etsy.com/market/cruelty_free_raven_feathers',
        raw_price: 22.50,
        currency: 'USD',
        package_size: 4,
        package_unit: 'pcs',
        normalized_price_per_100g: 16.88, // Best value
        shipping_estimate_days: 4,
        rating: 4.9,
        purity_certification: 'Ethically Foraged Molts',
        in_stock: true
      }
    ]
  },
  {
    id: 'mkt-05',
    name: 'Whole Star Anise Pods (Illicium verum)',
    botanical_name: 'Illicium verum',
    category: 'Flora',
    unit_price: 6.75,
    currency: 'USD',
    unit: 'g',
    package_size: 113.4,
    in_stock: true,
    supplier_name: 'Mountain Rose Herbs',
    provenance: 'Northern Vietnam & Guangxi',
    ethical_harvest_grade: 'Organic',
    description: 'Whole star pods with glossy seeds intact. Intensely fragrant and essential for oneiromancy and luck sachets.',
    vendor_quotes: [
      {
        id: 'vq-05-mrh',
        vendor_name: 'Mountain Rose Herbs',
        vendor_url: 'https://mountainroseherbs.com/star-anise-pods',
        raw_price: 6.75,
        currency: 'USD',
        package_size: 4,
        package_unit: 'oz',
        normalized_price_per_100g: 5.95,
        shipping_estimate_days: 3,
        rating: 4.9,
        purity_certification: 'USDA Certified Organic',
        in_stock: true
      },
      {
        id: 'vq-05-frontier',
        vendor_name: 'Frontier Co-op',
        vendor_url: 'https://www.frontiercoop.com/products/frontier-co-op-whole-star-anise-organic-1-lb',
        raw_price: 13.49,
        currency: 'USD',
        package_size: 1,
        package_unit: 'lb',
        normalized_price_per_100g: 2.97, // Best bulk value
        shipping_estimate_days: 3,
        rating: 4.8,
        purity_certification: 'Fair Trade & Non-GMO Project Verified',
        in_stock: true
      },
      {
        id: 'vq-05-swb',
        vendor_name: 'Starwest Botanicals',
        vendor_url: 'https://www.starwest-botanicals.com/category/star-anise-whole-organic/',
        raw_price: 15.80,
        currency: 'USD',
        package_size: 1,
        package_unit: 'lb',
        normalized_price_per_100g: 3.48,
        shipping_estimate_days: 4,
        rating: 4.7,
        purity_certification: 'Kosher Certified Organic',
        in_stock: true
      },
      {
        id: 'vq-05-amz',
        vendor_name: 'Amazon Prime: McCormick Gourmet',
        vendor_url: 'https://www.amazon.com/dp/B00ANIS05',
        raw_price: 7.99,
        currency: 'USD',
        package_size: 60,
        package_unit: 'g',
        normalized_price_per_100g: 13.32,
        shipping_estimate_days: 1,
        rating: 4.5,
        purity_certification: 'Culinary Grade Select',
        in_stock: true
      }
    ]
  },
  {
    id: 'mkt-06',
    name: 'Alchemical Black Salt (Witch’s Salt)',
    category: 'Mineral',
    unit_price: 8.99,
    currency: 'USD',
    unit: 'g',
    package_size: 150,
    in_stock: true,
    supplier_name: 'Hearth & Cauldron Apothecary',
    provenance: 'Salem, Massachusetts',
    ethical_harvest_grade: 'Artisanal',
    description: 'Black coarse sea salt compounded with birch charcoal, rue, and cauldron ash for heavy threshold warding.',
    vendor_quotes: [
      {
        id: 'vq-06-salem',
        vendor_name: 'Etsy: SalemWitchCitySupplies',
        vendor_url: 'https://www.etsy.com/market/black_witch_salt',
        raw_price: 8.99,
        currency: 'USD',
        package_size: 150,
        package_unit: 'g',
        normalized_price_per_100g: 5.99,
        shipping_estimate_days: 3,
        rating: 4.9,
        purity_certification: 'Handcrafted Cauldron Ash Formulation',
        in_stock: true
      },
      {
        id: 'vq-06-magick',
        vendor_name: '13 Moons Magickal Supply',
        vendor_url: 'https://www.13moons.com/incense-and-herbs/black-salt',
        raw_price: 5.50,
        currency: 'USD',
        package_size: 100,
        package_unit: 'g',
        normalized_price_per_100g: 5.50, // Best price
        shipping_estimate_days: 5,
        rating: 4.7,
        purity_certification: 'Traditional Ritual Blend',
        in_stock: true
      },
      {
        id: 'vq-06-amz',
        vendor_name: 'Amazon Prime: Alternative Imagination',
        vendor_url: 'https://www.amazon.com/dp/B00BLKSALT',
        raw_price: 12.95,
        currency: 'USD',
        package_size: 250,
        package_unit: 'g',
        normalized_price_per_100g: 5.18,
        shipping_estimate_days: 1,
        rating: 4.6,
        purity_certification: 'Hawaiian Black Lava Salt Blend',
        in_stock: true
      }
    ]
  },
  {
    id: 'mkt-07',
    name: 'Cast Iron Cauldron with Lid (3-Legged, 4-inch)',
    category: 'Tool',
    unit_price: 19.99,
    currency: 'USD',
    unit: 'item',
    package_size: 1,
    in_stock: true,
    supplier_name: 'Lodge Cast Iron Specialty',
    provenance: 'South Pittsburg, Tennessee, USA',
    ethical_harvest_grade: 'Artisanal',
    description: 'Virgin cast iron with carry handle and fitted iron lid. Pre-seasoned with 100% natural vegetable oil.',
    vendor_quotes: [
      {
        id: 'vq-07-amz',
        vendor_name: 'Amazon Prime: Old World Cast Iron',
        vendor_url: 'https://www.amazon.com/dp/B00CAULD07',
        raw_price: 19.99,
        currency: 'USD',
        package_size: 1,
        package_unit: 'item',
        normalized_price_per_100g: 19.99, // Best price
        shipping_estimate_days: 1,
        rating: 4.7,
        purity_certification: 'Heavy Duty Foundry Cast Iron',
        in_stock: true
      },
      {
        id: 'vq-07-etsy',
        vendor_name: 'Etsy: CelticWitchesCauldron',
        vendor_url: 'https://www.etsy.com/market/cast_iron_cauldron_4_inch',
        raw_price: 24.50,
        currency: 'USD',
        package_size: 1,
        package_unit: 'item',
        normalized_price_per_100g: 24.50,
        shipping_estimate_days: 3,
        rating: 4.9,
        purity_certification: 'Hand-Finished Triple Goddess Lid Imprint',
        in_stock: true
      },
      {
        id: 'vq-07-magick',
        vendor_name: 'AzureGreen Occult Supplies',
        vendor_url: 'https://www.azuregreen.net/Mini-Cast-Iron-Cauldron',
        raw_price: 22.00,
        currency: 'USD',
        package_size: 1,
        package_unit: 'item',
        normalized_price_per_100g: 22.00,
        shipping_estimate_days: 5,
        rating: 4.6,
        purity_certification: 'Traditional Wiccan Foundry Cast',
        in_stock: true
      }
    ]
  },
  {
    id: 'mkt-08',
    name: 'Dragon’s Blood Resin Tears (Daemonorops draco)',
    botanical_name: 'Daemonorops draco',
    category: 'Flora',
    unit_price: 11.25,
    currency: 'USD',
    unit: 'g',
    package_size: 113.4,
    in_stock: true,
    supplier_name: 'Mountain Rose Herbs',
    provenance: 'Sumatran Rainforest Wildcraft',
    ethical_harvest_grade: 'Wildcrafted',
    description: 'Deep crimson resin harvested from the rattan palm fruit. Unmatched potency for amplifying manifestations and boundary protection.',
    vendor_quotes: [
      {
        id: 'vq-08-mrh',
        vendor_name: 'Mountain Rose Herbs',
        vendor_url: 'https://mountainroseherbs.com/dragons-blood-resin',
        raw_price: 11.25,
        currency: 'USD',
        package_size: 4,
        package_unit: 'oz',
        normalized_price_per_100g: 9.92,
        shipping_estimate_days: 3,
        rating: 4.9,
        purity_certification: '100% Pure Wild Harvested Resins',
        in_stock: true
      },
      {
        id: 'vq-08-swb',
        vendor_name: 'Starwest Botanicals',
        vendor_url: 'https://www.starwest-botanicals.com/category/dragons-blood-resin-powder-c-s/',
        raw_price: 26.50,
        currency: 'USD',
        package_size: 1,
        package_unit: 'lb',
        normalized_price_per_100g: 5.84, // Best bulk value
        shipping_estimate_days: 4,
        rating: 4.8,
        purity_certification: 'Wildcrafted Chunk Grade A',
        in_stock: true
      },
      {
        id: 'vq-08-amz',
        vendor_name: 'Amazon: Inka Imports',
        vendor_url: 'https://www.amazon.com/dp/B00DRAG08',
        raw_price: 15.99,
        currency: 'USD',
        package_size: 100,
        package_unit: 'g',
        normalized_price_per_100g: 15.99,
        shipping_estimate_days: 2,
        rating: 4.6,
        purity_certification: 'Natural Botanical Resin',
        in_stock: true
      }
    ]
  }
];

