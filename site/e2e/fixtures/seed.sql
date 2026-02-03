-- ============================================================================
-- E2E Test Seed Data for Advyser
-- ============================================================================
-- This file creates test data for E2E testing purposes.
-- Compatible with Supabase Auth (auth.users) and public schema.
--
-- Test Accounts:
--   - test-consumer@advyser.test / TestPassword123! (consumer)
--   - test-advisor@advyser.test / TestPassword123! (advisor - James Mitchell)
--   - sarah.thompson@advyser.test / TestPassword123! (financial adviser)
--   - michael.wong@advyser.test / TestPassword123! (mortgage broker)
--   - jessica.patel@advyser.test / TestPassword123! (buyer's agent)
--
-- ============================================================================

-- Use a transaction to ensure atomicity
BEGIN;

-- ============================================================================
-- 1. CREATE TEST USERS IN auth.users (Supabase Auth)
-- ============================================================================
-- Note: In Supabase, auth.users is managed by GoTrue. For E2E tests, we insert
-- directly. The password hash is for 'TestPassword123!' using bcrypt.

-- Password hash for 'TestPassword123!' (bcrypt cost 10)
-- Generated using: SELECT crypt('TestPassword123!', gen_salt('bf', 10));

-- Consumer user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'test-consumer@advyser.test',
  '$2a$10$PznXKvMkBdAHJqMk.EbX7.dPuLJlKxrqj6jqC.YLHlY5lYBsJRhKe',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Emily", "last_name": "Chen"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Advisor user (James Mitchell - primary test advisor)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'test-advisor@advyser.test',
  '$2a$10$PznXKvMkBdAHJqMk.EbX7.dPuLJlKxrqj6jqC.YLHlY5lYBsJRhKe',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "James", "last_name": "Mitchell"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Additional advisor: Sarah Thompson (Financial Adviser)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000000',
  'sarah.thompson@advyser.test',
  '$2a$10$PznXKvMkBdAHJqMk.EbX7.dPuLJlKxrqj6jqC.YLHlY5lYBsJRhKe',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Sarah", "last_name": "Thompson"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Additional advisor: Michael Wong (Mortgage Broker)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  '00000000-0000-0000-0000-000000000000',
  'michael.wong@advyser.test',
  '$2a$10$PznXKvMkBdAHJqMk.EbX7.dPuLJlKxrqj6jqC.YLHlY5lYBsJRhKe',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Michael", "last_name": "Wong"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Additional advisor: Jessica Patel (Buyer's Agent)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  '00000000-0000-0000-0000-000000000000',
  'jessica.patel@advyser.test',
  '$2a$10$PznXKvMkBdAHJqMk.EbX7.dPuLJlKxrqj6jqC.YLHlY5lYBsJRhKe',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Jessica", "last_name": "Patel"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. CREATE CORRESPONDING PUBLIC.USERS RECORDS
-- ============================================================================

-- Consumer
INSERT INTO public.users (
  id,
  email,
  email_verified_at,
  role,
  first_name,
  last_name,
  display_name,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'test-consumer@advyser.test',
  NOW(),
  'consumer',
  'Emily',
  'Chen',
  'Emily Chen',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Primary Advisor (James Mitchell)
INSERT INTO public.users (
  id,
  email,
  email_verified_at,
  role,
  first_name,
  last_name,
  display_name,
  created_at,
  updated_at
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'test-advisor@advyser.test',
  NOW(),
  'advisor',
  'James',
  'Mitchell',
  'James Mitchell',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Sarah Thompson
INSERT INTO public.users (
  id,
  email,
  email_verified_at,
  role,
  first_name,
  last_name,
  display_name,
  created_at,
  updated_at
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'sarah.thompson@advyser.test',
  NOW(),
  'advisor',
  'Sarah',
  'Thompson',
  'Sarah Thompson',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Michael Wong
INSERT INTO public.users (
  id,
  email,
  email_verified_at,
  role,
  first_name,
  last_name,
  display_name,
  created_at,
  updated_at
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'michael.wong@advyser.test',
  NOW(),
  'advisor',
  'Michael',
  'Wong',
  'Michael Wong',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Jessica Patel
INSERT INTO public.users (
  id,
  email,
  email_verified_at,
  role,
  first_name,
  last_name,
  display_name,
  created_at,
  updated_at
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'jessica.patel@advyser.test',
  NOW(),
  'advisor',
  'Jessica',
  'Patel',
  'Jessica Patel',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. CREATE TEST LOCATIONS (Sydney & Melbourne)
-- ============================================================================

INSERT INTO public.location (id, state, suburb, postcode, lat, lng)
VALUES
  -- Sydney CBD
  ('aaaa1111-1111-1111-1111-111111111111', 'NSW', 'Sydney', '2000', -33.8688, 151.2093),
  -- North Sydney
  ('aaaa2222-2222-2222-2222-222222222222', 'NSW', 'North Sydney', '2060', -33.8384, 151.2070),
  -- Parramatta
  ('aaaa3333-3333-3333-3333-333333333333', 'NSW', 'Parramatta', '2150', -33.8151, 151.0011),
  -- Melbourne CBD
  ('aaaa4444-4444-4444-4444-444444444444', 'VIC', 'Melbourne', '3000', -37.8136, 144.9631),
  -- South Yarra
  ('aaaa5555-5555-5555-5555-555555555555', 'VIC', 'South Yarra', '3141', -37.8388, 144.9915)
ON CONFLICT (state, suburb, postcode) DO NOTHING;

-- ============================================================================
-- 4. CREATE TEST BUSINESSES
-- ============================================================================

-- James Mitchell's business (Financial Planning)
INSERT INTO public.business (
  id,
  legal_name,
  trading_name,
  abn,
  practice_type,
  website,
  phone,
  email,
  primary_location_id,
  address_line_1,
  claimed_status,
  claimed_by_user_id,
  claimed_at,
  created_source
) VALUES (
  'bbbb1111-1111-1111-1111-111111111111',
  'Mitchell Financial Services Pty Ltd',
  'Mitchell Financial',
  '12345678901',
  'independent',
  'https://mitchellfinancial.com.au',
  '02 9000 1111',
  'info@mitchellfinancial.com.au',
  'aaaa1111-1111-1111-1111-111111111111',
  'Level 10, 100 George Street',
  'claimed',
  '22222222-2222-2222-2222-222222222222',
  NOW(),
  'manual'
) ON CONFLICT (id) DO NOTHING;

-- Sarah Thompson's business (Financial Planning)
INSERT INTO public.business (
  id,
  legal_name,
  trading_name,
  abn,
  practice_type,
  website,
  phone,
  email,
  primary_location_id,
  address_line_1,
  claimed_status,
  claimed_by_user_id,
  claimed_at,
  created_source
) VALUES (
  'bbbb2222-2222-2222-2222-222222222222',
  'Thompson Wealth Advisory Pty Ltd',
  'Thompson Wealth',
  '23456789012',
  'boutique',
  'https://thompsonwealth.com.au',
  '02 9000 2222',
  'hello@thompsonwealth.com.au',
  'aaaa2222-2222-2222-2222-222222222222',
  'Suite 5, 50 Miller Street',
  'claimed',
  '33333333-3333-3333-3333-333333333333',
  NOW(),
  'manual'
) ON CONFLICT (id) DO NOTHING;

-- Michael Wong's business (Mortgage Broking)
INSERT INTO public.business (
  id,
  legal_name,
  trading_name,
  abn,
  practice_type,
  website,
  phone,
  email,
  primary_location_id,
  address_line_1,
  claimed_status,
  claimed_by_user_id,
  claimed_at,
  created_source
) VALUES (
  'bbbb3333-3333-3333-3333-333333333333',
  'Wong Mortgage Solutions Pty Ltd',
  'Wong Mortgages',
  '34567890123',
  'licensee',
  'https://wongmortgages.com.au',
  '03 9000 3333',
  'michael@wongmortgages.com.au',
  'aaaa4444-4444-4444-4444-444444444444',
  '200 Collins Street, Level 3',
  'claimed',
  '44444444-4444-4444-4444-444444444444',
  NOW(),
  'manual'
) ON CONFLICT (id) DO NOTHING;

-- Jessica Patel's business (Buyer's Agent)
INSERT INTO public.business (
  id,
  legal_name,
  trading_name,
  abn,
  practice_type,
  website,
  phone,
  email,
  primary_location_id,
  address_line_1,
  claimed_status,
  claimed_by_user_id,
  claimed_at,
  created_source
) VALUES (
  'bbbb4444-4444-4444-4444-444444444444',
  'Patel Property Partners Pty Ltd',
  'Patel Property',
  '45678901234',
  'independent',
  'https://patelproperty.com.au',
  '03 9000 4444',
  'jessica@patelproperty.com.au',
  'aaaa5555-5555-5555-5555-555555555555',
  '10 Toorak Road, Suite 12',
  'claimed',
  '55555555-5555-5555-5555-555555555555',
  NOW(),
  'manual'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. CREATE ADVISOR PROFILES
-- ============================================================================

-- James Mitchell
INSERT INTO public.advisor_profile (
  id,
  user_id,
  business_id,
  display_name,
  position_title,
  bio,
  years_experience,
  languages,
  linkedin_url
) VALUES (
  'cccc1111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'bbbb1111-1111-1111-1111-111111111111',
  'James Mitchell',
  'Senior Financial Adviser',
  'With over 15 years of experience in financial planning, I specialise in helping Australians achieve their retirement goals. I take a holistic approach, considering your entire financial picture including superannuation, investments, insurance, and estate planning.',
  15,
  ARRAY['English', 'Mandarin'],
  'https://linkedin.com/in/jamesmitchell'
) ON CONFLICT (id) DO NOTHING;

-- Sarah Thompson
INSERT INTO public.advisor_profile (
  id,
  user_id,
  business_id,
  display_name,
  position_title,
  bio,
  years_experience,
  languages,
  linkedin_url
) VALUES (
  'cccc2222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  'bbbb2222-2222-2222-2222-222222222222',
  'Sarah Thompson',
  'Certified Financial Planner',
  'I am passionate about empowering women to take control of their finances. My practice focuses on wealth accumulation strategies for professionals and business owners in their 30s-50s. I believe in building long-term relationships with my clients.',
  12,
  ARRAY['English'],
  'https://linkedin.com/in/sarahthompson'
) ON CONFLICT (id) DO NOTHING;

-- Michael Wong
INSERT INTO public.advisor_profile (
  id,
  user_id,
  business_id,
  display_name,
  position_title,
  bio,
  years_experience,
  languages,
  linkedin_url
) VALUES (
  'cccc3333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  'bbbb3333-3333-3333-3333-333333333333',
  'Michael Wong',
  'Senior Mortgage Broker',
  'As a mortgage broker with access to over 40 lenders, I help first home buyers and property investors find the right loan. Whether you are looking to buy your first home, refinance, or expand your property portfolio, I can guide you through the process.',
  8,
  ARRAY['English', 'Cantonese', 'Mandarin'],
  'https://linkedin.com/in/michaelwong'
) ON CONFLICT (id) DO NOTHING;

-- Jessica Patel
INSERT INTO public.advisor_profile (
  id,
  user_id,
  business_id,
  display_name,
  position_title,
  bio,
  years_experience,
  languages,
  linkedin_url
) VALUES (
  'cccc4444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  'bbbb4444-4444-4444-4444-444444444444',
  'Jessica Patel',
  'Licensed Buyer''s Agent',
  'I am a licensed buyer''s agent specialising in Melbourne''s inner suburbs. With extensive local knowledge and strong negotiation skills, I help busy professionals and interstate buyers find and secure their ideal property without the stress.',
  6,
  ARRAY['English', 'Hindi'],
  'https://linkedin.com/in/jessicapatel'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. CREATE LISTINGS
-- ============================================================================

-- James Mitchell - Financial Adviser
INSERT INTO public.listing (
  id,
  business_id,
  advisor_profile_id,
  headline,
  bio,
  what_i_help_with,
  approach_to_advice,
  advisor_type,
  service_mode,
  fee_model,
  price_band,
  minimum_investment,
  free_consultation,
  client_demographics,
  is_active,
  accepting_status,
  verification_level,
  profile_completeness_score,
  response_time_hours,
  response_rate,
  rating_avg,
  review_count
) VALUES (
  'dddd1111-1111-1111-1111-111111111111',
  'bbbb1111-1111-1111-1111-111111111111',
  'cccc1111-1111-1111-1111-111111111111',
  'Expert Retirement Planning for a Secure Future',
  'With over 15 years of experience in financial planning, I specialise in helping Australians achieve their retirement goals.',
  'Retirement planning, SMSF setup and management, wealth accumulation strategies, insurance review, estate planning',
  'I take a holistic approach to financial advice, considering your entire financial picture. I believe in building long-term relationships and providing ongoing support as your circumstances change.',
  'financial_adviser',
  'both',
  'ongoing',
  '$3,500 initial SOA + $3,300/year ongoing',
  50000.00,
  true,
  ARRAY['retirees', 'pre-retirees', 'high-net-worth'],
  true,
  'taking_clients',
  'licence_verified',
  95,
  2.5,
  98.5,
  4.8,
  12
) ON CONFLICT (id) DO NOTHING;

-- Sarah Thompson - Financial Adviser
INSERT INTO public.listing (
  id,
  business_id,
  advisor_profile_id,
  headline,
  bio,
  what_i_help_with,
  approach_to_advice,
  advisor_type,
  service_mode,
  fee_model,
  price_band,
  minimum_investment,
  free_consultation,
  client_demographics,
  is_active,
  accepting_status,
  verification_level,
  profile_completeness_score,
  response_time_hours,
  response_rate,
  rating_avg,
  review_count
) VALUES (
  'dddd2222-2222-2222-2222-222222222222',
  'bbbb2222-2222-2222-2222-222222222222',
  'cccc2222-2222-2222-2222-222222222222',
  'Empowering Women to Build Wealth',
  'I am passionate about empowering women to take control of their finances through education and tailored advice.',
  'Wealth accumulation, salary packaging, investment strategy, superannuation consolidation, insurance needs analysis',
  'My approach is collaborative and educational. I take the time to explain concepts clearly and ensure you feel confident in every financial decision.',
  'financial_adviser',
  'both',
  'fixed',
  '$2,200-$4,000 per project',
  25000.00,
  true,
  ARRAY['professionals', 'business-owners', 'women'],
  true,
  'taking_clients',
  'licence_verified',
  90,
  4.0,
  95.0,
  4.9,
  8
) ON CONFLICT (id) DO NOTHING;

-- Michael Wong - Mortgage Broker
INSERT INTO public.listing (
  id,
  business_id,
  advisor_profile_id,
  headline,
  bio,
  what_i_help_with,
  approach_to_advice,
  advisor_type,
  service_mode,
  fee_model,
  price_band,
  free_consultation,
  client_demographics,
  is_active,
  accepting_status,
  verification_level,
  profile_completeness_score,
  response_time_hours,
  response_rate,
  rating_avg,
  review_count
) VALUES (
  'dddd3333-3333-3333-3333-333333333333',
  'bbbb3333-3333-3333-3333-333333333333',
  'cccc3333-3333-3333-3333-333333333333',
  'Your Path to Home Ownership Starts Here',
  'Access to 40+ lenders means I can find the right loan for your situation, whether you are a first home buyer or seasoned investor.',
  'First home buyer loans, investment property loans, refinancing, debt consolidation, construction loans',
  'I guide you through every step of the mortgage process, from pre-approval to settlement. No question is too small, and I am always available to chat.',
  'mortgage_broker',
  'both',
  'percentage',
  'Commission-based (no cost to you)',
  true,
  ARRAY['first-home-buyers', 'investors', 'young-professionals'],
  true,
  'taking_clients',
  'licence_verified',
  88,
  1.5,
  99.0,
  4.7,
  15
) ON CONFLICT (id) DO NOTHING;

-- Jessica Patel - Buyer's Agent
INSERT INTO public.listing (
  id,
  business_id,
  advisor_profile_id,
  headline,
  bio,
  what_i_help_with,
  approach_to_advice,
  advisor_type,
  service_mode,
  fee_model,
  price_band,
  free_consultation,
  client_demographics,
  is_active,
  accepting_status,
  verification_level,
  profile_completeness_score,
  response_time_hours,
  response_rate,
  rating_avg,
  review_count
) VALUES (
  'dddd4444-4444-4444-4444-444444444444',
  'bbbb4444-4444-4444-4444-444444444444',
  'cccc4444-4444-4444-4444-444444444444',
  'Melbourne Property Expert - Your Advantage in a Competitive Market',
  'Local knowledge and proven negotiation skills to help you secure the right property at the right price.',
  'Property search, auction bidding, off-market opportunities, vendor negotiation, investment property acquisition',
  'I work exclusively for buyers, never sellers. This means my interests are 100% aligned with yours. I combine local market expertise with strong relationships in the industry to give you an edge.',
  'buyers_agent',
  'in_person',
  'fixed',
  '2% of purchase price or $20,000 minimum',
  false,
  ARRAY['busy-professionals', 'interstate-buyers', 'investors'],
  true,
  'waitlist',
  'basic',
  82,
  8.0,
  92.0,
  4.6,
  6
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. CREATE SERVICE AREAS
-- ============================================================================

-- James Mitchell - Sydney metro
INSERT INTO public.listing_service_area (listing_id, location_id)
VALUES
  ('dddd1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111'),
  ('dddd1111-1111-1111-1111-111111111111', 'aaaa2222-2222-2222-2222-222222222222'),
  ('dddd1111-1111-1111-1111-111111111111', 'aaaa3333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- Sarah Thompson - North Sydney + nationwide online
INSERT INTO public.listing_service_area (listing_id, location_id)
VALUES ('dddd2222-2222-2222-2222-222222222222', 'aaaa2222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

INSERT INTO public.listing_service_area (listing_id, is_nationwide)
VALUES ('dddd2222-2222-2222-2222-222222222222', true)
ON CONFLICT DO NOTHING;

-- Michael Wong - Melbourne metro
INSERT INTO public.listing_service_area (listing_id, location_id)
VALUES
  ('dddd3333-3333-3333-3333-333333333333', 'aaaa4444-4444-4444-4444-444444444444'),
  ('dddd3333-3333-3333-3333-333333333333', 'aaaa5555-5555-5555-5555-555555555555')
ON CONFLICT DO NOTHING;

-- Jessica Patel - Melbourne inner suburbs
INSERT INTO public.listing_service_area (listing_id, location_id)
VALUES
  ('dddd4444-4444-4444-4444-444444444444', 'aaaa4444-4444-4444-4444-444444444444'),
  ('dddd4444-4444-4444-4444-444444444444', 'aaaa5555-5555-5555-5555-555555555555')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. CREATE CREDENTIALS
-- ============================================================================

-- James Mitchell - AFSL Authorised Rep
INSERT INTO public.credential (
  id,
  advisor_profile_id,
  business_id,
  credential_type,
  credential_number,
  name_on_register,
  issuing_body,
  verification_status,
  verification_source,
  verified_at,
  register_url
) VALUES (
  'eeee1111-1111-1111-1111-111111111111',
  'cccc1111-1111-1111-1111-111111111111',
  'bbbb1111-1111-1111-1111-111111111111',
  'authorised_rep',
  '001234567',
  'James Mitchell',
  'ASIC',
  'verified',
  'asic_far',
  NOW(),
  'https://moneysmart.gov.au/financial-advice/financial-advisers-register'
) ON CONFLICT (id) DO NOTHING;

-- Sarah Thompson - AFSL Authorised Rep
INSERT INTO public.credential (
  id,
  advisor_profile_id,
  business_id,
  credential_type,
  credential_number,
  name_on_register,
  issuing_body,
  verification_status,
  verification_source,
  verified_at,
  register_url
) VALUES (
  'eeee2222-2222-2222-2222-222222222222',
  'cccc2222-2222-2222-2222-222222222222',
  'bbbb2222-2222-2222-2222-222222222222',
  'authorised_rep',
  '001234568',
  'Sarah Thompson',
  'ASIC',
  'verified',
  'asic_far',
  NOW(),
  'https://moneysmart.gov.au/financial-advice/financial-advisers-register'
) ON CONFLICT (id) DO NOTHING;

-- Michael Wong - ACL Credit Rep
INSERT INTO public.credential (
  id,
  advisor_profile_id,
  business_id,
  credential_type,
  credential_number,
  name_on_register,
  issuing_body,
  verification_status,
  verification_source,
  verified_at,
  register_url
) VALUES (
  'eeee3333-3333-3333-3333-333333333333',
  'cccc3333-3333-3333-3333-333333333333',
  'bbbb3333-3333-3333-3333-333333333333',
  'credit_rep',
  '456789',
  'Michael Wong',
  'ASIC',
  'verified',
  'asic_prs',
  NOW(),
  'https://moneysmart.gov.au/check-your-broker'
) ON CONFLICT (id) DO NOTHING;

-- Jessica Patel - Real Estate Licence (VIC)
INSERT INTO public.credential (
  id,
  advisor_profile_id,
  business_id,
  credential_type,
  credential_number,
  name_on_register,
  issuing_body,
  state,
  verification_status,
  verification_source,
  verified_at
) VALUES (
  'eeee4444-4444-4444-4444-444444444444',
  'cccc4444-4444-4444-4444-444444444444',
  'bbbb4444-4444-4444-4444-444444444444',
  'buyers_agent_licence',
  'VIC-BA-12345',
  'Jessica Patel',
  'Consumer Affairs Victoria',
  'VIC',
  'verified',
  'state_register',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 9. CREATE ADVISOR BUSINESS ROLES
-- ============================================================================

INSERT INTO public.advisor_business_role (user_id, business_id, role, status, accepted_at)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'bbbb1111-1111-1111-1111-111111111111', 'owner', 'active', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'bbbb2222-2222-2222-2222-222222222222', 'owner', 'active', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'bbbb3333-3333-3333-3333-333333333333', 'owner', 'active', NOW()),
  ('55555555-5555-5555-5555-555555555555', 'bbbb4444-4444-4444-4444-444444444444', 'owner', 'active', NOW())
ON CONFLICT (user_id, business_id) DO NOTHING;

-- ============================================================================
-- 10. CREATE TEST LEADS (from consumer to advisors)
-- ============================================================================

INSERT INTO public.lead (
  id,
  consumer_user_id,
  business_id,
  listing_id,
  problem_summary,
  goal_tags,
  timeline,
  budget_range,
  preferred_meeting_mode,
  status,
  first_response_at,
  response_time_minutes
) VALUES
  -- Lead to James Mitchell (converted)
  (
    'ffff1111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'bbbb1111-1111-1111-1111-111111111111',
    'dddd1111-1111-1111-1111-111111111111',
    'I am approaching retirement in 5 years and want to ensure I have enough to maintain my lifestyle.',
    ARRAY['retirement', 'superannuation', 'investment'],
    '5+ years',
    '$50,000+',
    'both',
    'converted',
    NOW() - INTERVAL '2 hours',
    120
  ),
  -- Lead to Sarah Thompson (new)
  (
    'ffff2222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'bbbb2222-2222-2222-2222-222222222222',
    'dddd2222-2222-2222-2222-222222222222',
    'I recently received a promotion and want advice on salary packaging and investment options.',
    ARRAY['investment', 'salary-packaging', 'wealth'],
    '1-3 months',
    'Not sure',
    'online',
    'new',
    NULL,
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 11. CREATE REVIEWS
-- ============================================================================

-- Reviews for James Mitchell
INSERT INTO public.review (
  id,
  lead_id,
  consumer_user_id,
  business_id,
  listing_id,
  rating,
  title,
  body,
  status
) VALUES
  (
    'gggg1111-1111-1111-1111-111111111111',
    'ffff1111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'bbbb1111-1111-1111-1111-111111111111',
    'dddd1111-1111-1111-1111-111111111111',
    5,
    'Excellent retirement planning advice',
    'James took the time to understand our situation and created a comprehensive plan. He explained everything clearly and we now feel confident about our retirement. Highly recommend!',
    'published'
  )
ON CONFLICT (id) DO NOTHING;

-- Additional reviews for other advisors (created by system/other users)
-- Note: These use the consumer ID but would typically be from different consumers in production

-- Review for Sarah Thompson
INSERT INTO public.lead (id, consumer_user_id, business_id, listing_id, status)
VALUES ('ffff3333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'bbbb2222-2222-2222-2222-222222222222', 'dddd2222-2222-2222-2222-222222222222', 'converted')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.review (
  id,
  lead_id,
  consumer_user_id,
  business_id,
  listing_id,
  rating,
  title,
  body,
  status
) VALUES
  (
    'gggg2222-2222-2222-2222-222222222222',
    'ffff3333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'bbbb2222-2222-2222-2222-222222222222',
    'dddd2222-2222-2222-2222-222222222222',
    5,
    'Finally understand my finances!',
    'Sarah made me feel comfortable from our first meeting. She took a genuine interest in my goals and explained complex concepts in simple terms. I now have a clear investment strategy.',
    'published'
  )
ON CONFLICT (id) DO NOTHING;

-- Review for Michael Wong
INSERT INTO public.lead (id, consumer_user_id, business_id, listing_id, status)
VALUES ('ffff4444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'bbbb3333-3333-3333-3333-333333333333', 'dddd3333-3333-3333-3333-333333333333', 'converted')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.review (
  id,
  lead_id,
  consumer_user_id,
  business_id,
  listing_id,
  rating,
  title,
  body,
  status
) VALUES
  (
    'gggg3333-3333-3333-3333-333333333333',
    'ffff4444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'bbbb3333-3333-3333-3333-333333333333',
    'dddd3333-3333-3333-3333-333333333333',
    5,
    'Made buying my first home easy',
    'Michael found me a great loan with a competitive rate. He handled all the paperwork and kept me updated throughout the process. Could not have done it without him!',
    'published'
  ),
  (
    'gggg4444-4444-4444-4444-444444444444',
    'ffff4444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'bbbb3333-3333-3333-3333-333333333333',
    'dddd3333-3333-3333-3333-333333333333',
    4,
    'Great service, minor communication delays',
    'Michael got me a fantastic rate and the process was smooth. Only minor issue was some delays in getting updates, but overall very happy with the outcome.',
    'published'
  )
ON CONFLICT (id) DO NOTHING;

-- Review for Jessica Patel
INSERT INTO public.lead (id, consumer_user_id, business_id, listing_id, status)
VALUES ('ffff5555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'bbbb4444-4444-4444-4444-444444444444', 'dddd4444-4444-4444-4444-444444444444', 'converted')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.review (
  id,
  lead_id,
  consumer_user_id,
  business_id,
  listing_id,
  rating,
  title,
  body,
  status
) VALUES
  (
    'gggg5555-5555-5555-5555-555555555555',
    'ffff5555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'bbbb4444-4444-4444-4444-444444444444',
    'dddd4444-4444-4444-4444-444444444444',
    5,
    'Found our dream home in South Yarra',
    'Jessica''s local knowledge was invaluable. She found us an off-market property that we never would have discovered on our own. Her negotiation skills saved us thousands.',
    'published'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 12. SET FEATURED REVIEWS
-- ============================================================================

UPDATE public.listing SET featured_review_id = 'gggg1111-1111-1111-1111-111111111111' WHERE id = 'dddd1111-1111-1111-1111-111111111111';
UPDATE public.listing SET featured_review_id = 'gggg2222-2222-2222-2222-222222222222' WHERE id = 'dddd2222-2222-2222-2222-222222222222';
UPDATE public.listing SET featured_review_id = 'gggg3333-3333-3333-3333-333333333333' WHERE id = 'dddd3333-3333-3333-3333-333333333333';
UPDATE public.listing SET featured_review_id = 'gggg5555-5555-5555-5555-555555555555' WHERE id = 'dddd4444-4444-4444-4444-444444444444';

-- ============================================================================
-- 13. CREATE LISTING SPECIALTIES
-- ============================================================================

-- Get specialty IDs and link to listings
INSERT INTO public.listing_specialty (listing_id, specialty_id)
SELECT 'dddd1111-1111-1111-1111-111111111111', id FROM public.specialty WHERE slug IN ('retirement-planning', 'smsf', 'estate-planning')
ON CONFLICT DO NOTHING;

INSERT INTO public.listing_specialty (listing_id, specialty_id)
SELECT 'dddd2222-2222-2222-2222-222222222222', id FROM public.specialty WHERE slug IN ('wealth-accumulation', 'insurance')
ON CONFLICT DO NOTHING;

INSERT INTO public.listing_specialty (listing_id, specialty_id)
SELECT 'dddd3333-3333-3333-3333-333333333333', id FROM public.specialty WHERE slug IN ('first-home-buyers', 'investment-loans', 'refinancing')
ON CONFLICT DO NOTHING;

INSERT INTO public.listing_specialty (listing_id, specialty_id)
SELECT 'dddd4444-4444-4444-4444-444444444444', id FROM public.specialty WHERE slug IN ('residential-buyers-agent', 'investment-buyers-agent', 'auction-bidding')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 14. CREATE CONVERSATION (for messaging tests)
-- ============================================================================

INSERT INTO public.conversation (
  id,
  lead_id,
  consumer_user_id,
  business_id,
  subject,
  last_message_at
) VALUES (
  'hhhh1111-1111-1111-1111-111111111111',
  'ffff1111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'bbbb1111-1111-1111-1111-111111111111',
  'Retirement planning inquiry',
  NOW()
) ON CONFLICT (consumer_user_id, business_id) DO NOTHING;

-- Sample messages
INSERT INTO public.message (
  id,
  conversation_id,
  sender_user_id,
  body,
  status
) VALUES
  (
    'iiii1111-1111-1111-1111-111111111111',
    'hhhh1111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Hi James, I am interested in discussing retirement planning options. When would you be available for a call?',
    'delivered'
  ),
  (
    'iiii2222-2222-2222-2222-222222222222',
    'hhhh1111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Hi Emily, thanks for reaching out! I would be happy to discuss your retirement planning needs. I have availability this Thursday at 2pm or Friday at 10am. Which works better for you?',
    'delivered'
  )
ON CONFLICT (id) DO NOTHING;

COMMIT;
