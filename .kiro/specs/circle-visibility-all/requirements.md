# Requirements Document

## Introduction

This feature modifies the community circle visibility system to display all circles (both public and private) to all authenticated users. Currently, users can only see public circles and private circles they are members of. This change will allow users to discover all available circles while maintaining the privacy controls for joining private circles (invite code requirement).

## Glossary

- **Circle System**: The community feature that allows users to create and join groups for shared habit tracking and social interaction
- **Public Circle**: A circle with `isPrivate: false` that any user can join without an invite code
- **Private Circle**: A circle with `isPrivate: true` that requires an invite code to join
- **Circle Visibility**: The ability for users to see circles in the circle list
- **Circle Access**: The ability for users to view detailed information and join a circle
- **Authenticated User**: A logged-in user with a valid authentication token

## Requirements

### Requirement 1

**User Story:** As a user browsing the community page, I want to see all available circles (both public and private), so that I can discover communities I might want to join

#### Acceptance Criteria

1. WHEN an authenticated user requests the circle list, THE Circle System SHALL return all circles regardless of privacy setting
2. THE Circle System SHALL display both public and private circles in the same list view
3. THE Circle System SHALL indicate which circles are private with a lock icon
4. THE Circle System SHALL show the member count and available spots for all circles
5. WHEN displaying private circles, THE Circle System SHALL not reveal the invite code in the list view

### Requirement 2

**User Story:** As a user viewing a private circle in the list, I want to understand that it requires an invite code, so that I know how to join it

#### Acceptance Criteria

1. WHEN a private circle is displayed in the list, THE Circle System SHALL show a visual indicator (lock icon) that it is private
2. WHEN a user clicks on a private circle they are not a member of, THE Circle System SHALL prompt for an invite code
3. THE Circle System SHALL maintain the existing invite code validation when joining private circles
4. THE Circle System SHALL prevent users from viewing detailed circle information without being a member or providing a valid invite code

### Requirement 3

**User Story:** As a circle creator, I want my private circle to be discoverable but still protected by an invite code, so that I can control who joins while allowing interested users to find it

#### Acceptance Criteria

1. THE Circle System SHALL display private circles in search results
2. THE Circle System SHALL require invite code validation before allowing users to join private circles
3. THE Circle System SHALL maintain existing access controls for viewing private circle details
4. WHEN a user searches for circles, THE Circle System SHALL include both public and private circles in the results
5. THE Circle System SHALL not change the behavior of invite code generation or validation

### Requirement 4

**User Story:** As a user, I want the circle list to clearly distinguish between circles I can join freely and those requiring an invite code, so that I can make informed decisions about which circles to explore

#### Acceptance Criteria

1. THE Circle System SHALL display a "Join Circle" button for public circles the user is not a member of
2. THE Circle System SHALL display a "Join Circle" button for private circles the user is not a member of
3. WHEN a user clicks "Join Circle" on a public circle, THE Circle System SHALL join the circle without requiring an invite code
4. WHEN a user clicks "Join Circle" on a private circle, THE Circle System SHALL prompt for an invite code before joining
5. THE Circle System SHALL display a "View Circle" button for circles the user is already a member of
