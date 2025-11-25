# Implementation Plan

- [x] 1. Modify backend circle query to return all circles

  - Update the `getCircles` function in `server/src/controllers/communityController.js`
  - Remove the privacy-based filtering from the MongoDB query
  - Change query from `{ $or: [{ isPrivate: false }, { 'members.userId': userId }] }` to `{}`
  - Ensure search functionality still works by conditionally adding search filter to query
  - Verify pagination logic remains intact
  - _Requirements: 1.1, 1.2, 3.4_

- [x] 1.1 Test backend circle retrieval

  - Verify all circles (public and private) are returned in API response
  - Test search functionality includes both public and private circles
  - Verify pagination works correctly with all circles
  - Test membership status flags (`userIsMember`, `userIsAdmin`) are accurate
  - _Requirements: 1.1, 1.2, 3.4_

- [x] 2. Verify frontend displays all circles correctly

  - Load the community page and verify both public and private circles appear
  - Confirm lock icons display on private circles
  - Verify "Join Circle" buttons appear for non-member circles
  - Test search functionality filters all circle types
  - _Requirements: 1.2, 1.3, 4.1, 4.2_

- [x] 3. Test private circle join flow

  - Attempt to join a private circle without invite code (should prompt for code)
  - Attempt to join with invalid invite code (should fail with error)
  - Join private circle with valid invite code (should succeed)
  - Verify access controls prevent viewing private circle details without membership
  - _Requirements: 2.2, 2.3, 4.4_

- [x] 4. Test public circle join flow

  - Join a public circle (should work without invite code prompt)
  - Verify immediate membership without additional prompts

  - Confirm button changes to "View Circle" after joining
  - _Requirements: 4.3, 4.5_
