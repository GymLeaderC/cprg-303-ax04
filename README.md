# Assignment 4 - Supabase Authentication

## Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file in the root with:
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Run `npx expo start`

## Supabase Setup

- Project created at supabase.com
- Auth is enabled by default (no additional configuration needed)
- Email confirmation: [note whether you left it enabled or disabled in Supabase dashboard]

## Test Accounts

- Email: test@example.com / Password: Test1234!
(or whatever test account you create)

## Notes

- `.env` is listed in `.gitignore` and is not committed
- Sessions persist across app launches via AsyncStorage