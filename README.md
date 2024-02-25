# dimitrmo/cargo-verison-action

Uses [cargo-verison](https://github.com/dimitrmo/cargo-verison) to bump the version, tag and commit.

## Usage

```yaml
      - name: Cargo Verison
        id: verison
        uses: dimitrmo/cargo-verison-action@v1.0.17
        with:
          message: "Release %s

          [skip ci]
          "
```

## Useful links

* [cargo-verison](https://github.com/dimitrmo/cargo-verison)
* [Creating a JavaScript action](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)
