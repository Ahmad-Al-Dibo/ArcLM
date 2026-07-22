from arclm import model_support_matrix

for row in model_support_matrix():
    print(row["Model"], row["Status"])
