# Github action for publishing content of markdown to Confluence

## Description
This action requires markdown file or content of markdown file as content. Information about your confleunce instance needs to be provided as well. 

## Inputs
### Standard inputs
- markdown - Input markdown as string
- filename - Provide name of markdown file, this file needs to be checked out
- spacekey - Key of confluence space where page should be created
- cnflurl - Base URL of your confluence instance
- title - Title for page which will be created
- cnfluser - Username which be used as author of page
- apikey - API key for authentication, must be key for user specified as CNFL_USER
## Examples
#### Use this action with standard README.md file checked out from your repository
    name: Publish markdown to Confleunce
    on:
    workflow_dispatch:
    push:
        branches:
        - main

    jobs:
      publish:
        runs-on: ubuntu-latest
        name: publish markdown
        steps:
        - name: checkout
            uses: actions/checkout@v3
            with:
              sparse-checkout: |
                README.md
              sparse-checkout-cone-mode: false
        - name: call action
            uses: tomasstorc/markdown-to-confluence@main
            with:
                filename: README.md
                spacekey: ~701219c9808ed6f6b4abda4f307a0e1ab58a6
                cnflurl: https://tstest-dev.atlassian.net/
                title: "Page created from markdown"
                cnfluser: ${{ secrets.CNFL_USER }}
                apikey: ${{ secrets.API_KEY }}

#### Use this action with string as input
    name: Publish markdown to Confleunce
    on:
      workflow_dispatch:
      push:
        branches:
        - main

    jobs:
      publish:
        runs-on: ubuntu-latest
        name: publish markdown
        steps:
        - name: call action
            uses: tomasstorc/markdown-to-confluence@main
            with:
              markdown: '### markdown text'
              spacekey: ~701219c9808ed6f6b4abda4f307a0e1ab58a6
              cnflurl: https://tstest-dev.atlassian.net/
              title: "Page created from markdown"
              cnfluser: ${{ secrets.CNFL_USER }}
              apikey: ${{ secrets.API_KEY }}
## TODO
- [X] Add function to just update existing page
- [X] Check if markdown or filename are provided
- [X] Remove environment variables completely for unification
- [X] Remove the need for node modules (ncc)
- [X] Replace JavaScript with TypeScript
- [X] Check if instance is being run in Atlassian cloud
- [ ] Automatically update version number



