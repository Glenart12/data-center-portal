# Page snapshot

```yaml
- main [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - img "datacenterportal" [ref=e8]
        - heading "Welcome" [level=1] [ref=e9]
        - paragraph [ref=e11]: Log in to datacenterportal to continue to data-center-portal.
      - generic [ref=e13]:
        - generic [ref=e15]:
          - generic [ref=e17]:
            - generic [ref=e18]:
              - text: Email address
              - generic [ref=e19]: "*"
            - textbox "Email address" [active] [ref=e20]
          - generic [ref=e22]:
            - generic [ref=e23]:
              - text: Password
              - generic [ref=e24]: "*"
            - textbox "Password" [ref=e25]
            - switch "Show password" [ref=e26] [cursor=pointer]
        - paragraph [ref=e27]:
          - link "Forgot password?" [ref=e28] [cursor=pointer]:
            - /url: /u/login/password-reset-start/Username-Password-Authentication?state=hKFo2SB3aWtLY3p3TjcyNGtOek0tX25FSzlJWGFvTFlISUJYWaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIDdxX1cxNFdZMG9GX1ZGUjVDUEd0LXFkTGdSZHZPS25Bo2NpZNkgY3NGaUtZVk9xblhRY1REM1JMZmMwcTFqM3hQV0ZNdWY
        - button "Continue" [ref=e30] [cursor=pointer]
    - link "Link to the Auth0 website" [ref=e31] [cursor=pointer]:
      - /url: https://auth0.com/?utm_source=lock&utm_campaign=badge&utm_medium=widget
```