# Padding And Truncation

Padding modes:

- `longest`: vul aan tot het langste voorbeeld in de batch
- `max_length`: vul aan tot `max_length`
- `none`: vereist gelijke lengte

Truncation knipt rechts af tot `max_length`. Bij assistant-only loss kan een
voorbeeld fout geven als truncation alle assistant tokens verwijdert.
