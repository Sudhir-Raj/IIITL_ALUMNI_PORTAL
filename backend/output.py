import pandas as pd
import numpy as np
import re


post_data = pd.read_csv(r'postnew_data (1).csv')
user_data = pd.read_csv(r'user_data (2).csv')
view_data = pd.read_csv(r'view_data (1).csv')

post_data = post_data.drop(['title','category'], axis=1)

dataframe = pd.DataFrame(view_data)


dataframe["Valuable"] = np.random.randint(1, 6, len(dataframe))

df = pd.merge(dataframe, post_data ,on='post_id')

data = df.drop('time_stamp', axis=1)


combine_post_rating = data.dropna(axis = 0, subset = ['content'])

post_ratingCount = (combine_post_rating.
     groupby(by = ['content'])['Valuable'].
     count().
     reset_index().
     rename(columns = {'Valuable': 'totalValuableCount'})
     [['content', 'totalValuableCount']]
    )
post_ratingCount.head() 


rating_with_totalValuableCount = combine_post_rating.merge(post_ratingCount, left_on = 'content', right_on = 'content', how = 'left')

pd.set_option('display.float_format', lambda x: '%.3f' % x)


popularity_threshold = 13
rating_popular_post = rating_with_totalValuableCount.query('totalValuableCount >= @popularity_threshold')


from scipy.sparse import csr_matrix
rating_popular_post = rating_popular_post.drop_duplicates(['user_id', 'content'])
rating_popular_post_pivot = rating_popular_post.pivot(index = 'content', columns = 'user_id', values = 'Valuable').fillna(0)
rating_popular_post_matrix = csr_matrix(rating_popular_post_pivot.values)

from sklearn.neighbors import NearestNeighbors


model_knn = NearestNeighbors(metric = 'cosine', algorithm = 'brute')
model_knn.fit(rating_popular_post_matrix)


query_index = np.random.choice(rating_popular_post_pivot.shape[0])
distances, indices = model_knn.kneighbors(rating_popular_post_pivot.iloc[query_index,:].values.reshape(1, -1), n_neighbors = 6)


# this is our name of user 3 and posts he has seen or vote it and our task is to recommend it similiar
#post
rating_popular_post_pivot.index[query_index]

def fun():
    lis = []

    #Here we go
    for i in range(1, len(distances.flatten())):
        lis.append(rating_popular_post_pivot.index[indices.flatten()[i]])

    return lis
