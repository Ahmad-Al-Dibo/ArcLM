# Perplexity

`Perplexity` gebruikt:

```text
perplexity = exp(loss)
```

De metric gebruikt de gemiddelde batch loss. Als er geen bruikbare loss is, geeft de metric `None` terug.

Bij extreem grote of ongeldige loss geeft de metric `inf` terug in plaats van te crashen.
