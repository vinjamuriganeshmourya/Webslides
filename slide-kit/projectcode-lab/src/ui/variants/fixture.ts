import type { ProjectFigureProps, TourStop } from './projectFigure'

/**
 * ONE PROJECT SLICE, RENDERED BY EVERY VARIANT.
 *
 * The comparison is worth nothing unless the content is identical, so this is the
 * only content in the lab.
 *
 * WHY A DJANGO API SLICE AND NOT SOMETHING NEUTRAL
 *
 * The sibling labs use deliberately neutral fixtures, because they are choosing a
 * shape for a diagram and a familiar subject would bias the judgement toward
 * whichever variant flatters it. This lab is the opposite case: the thing being
 * judged IS how well a layout explains real code spread across real files, and
 * invented code cannot test that. A four-file slice of the stack this course
 * actually teaches is the honest fixture.
 *
 * It is the request's own path, which is what makes it a tour rather than four
 * files: a GET arrives at `urls.py`, is dispatched to `views.py`, which asks
 * `serializers.py` to turn `models.py` rows into JSON. Every stop hands to the
 * next, so a variant that draws the handover has something real to draw.
 *
 * THE CODE IS CORRECT AND MINIMAL. It is not a reconstruction of a session's
 * deck: it is the smallest slice that genuinely runs, so a variant cannot be
 * flattered by code that would not work. Four files, four layers, five stops.
 */

/*
  THE ROUTE IS THE REQUEST'S OWN PATH, not the order the files were written.

    That is the whole argument for a tour over a file listing: a learner opening
    this app for the first time does not need to know that `models.py` exists
    before `urls.py`, they need to know what happens when somebody visits a URL.
    Reading order and execution order are different, and a walkthrough should
    follow the one that answers the question.

  `via` names the MECHANISM of each handover, so a variant can label the edge
  rather than drawing an unexplained arrow.
*/
const requestRoute: TourStop[] = [
    {
      id: 'route',
      file: 'products/urls.py',
      range: [5, 7],
      title: 'The address is the entry point',
      body: 'Nothing runs until a URL matches this pattern.',
      via: 'GET /api/products/',
      detail: 'The trailing slash matters: without it Django redirects, and a client that does not follow redirects sees a 301 rather than the list.',
    },
    {
      id: 'view',
      file: 'products/views.py',
      range: [8, 12],
      title: 'The view is four lines and no logic',
      body: 'Fetch, serialize, respond. Anything more belongs elsewhere.',
      via: 'calls',
      detail: 'The decorator rejects every verb except GET before this function body runs, which is why there is no method check inside it.',
    },
    {
      id: 'query',
      file: 'products/views.py',
      range: [10, 10],
      title: 'One line reaches the database',
      body: 'A queryset, not a list. Nothing has been fetched yet.',
      via: 'lazy queryset',
      detail: 'Django does not hit the database here. The query runs when the serializer iterates it on the next line, which is why a slow endpoint is rarely slow on the line that looks like the query.',
    },
    {
      id: 'serialize',
      file: 'products/serializers.py',
      range: [6, 9],
      title: 'The field list is the contract',
      body: 'Whatever is named here is what the client receives.',
      via: 'reads Product',
      detail: 'Adding a field to the model changes nothing on the wire until it is added here too. That is the single most common cause of "my new column is missing from the API".',
    },
  {
    id: 'model',
    file: 'products/models.py',
    range: [4, 7],
    title: 'And the model is where it all resolves',
    body: 'The serializer takes its types from these three lines.',
    via: 'defines',
    detail: 'DecimalField is deliberate: a float would introduce rounding error in prices, and the serializer emits it as a string for exactly that reason.',
  },
]

/*
  THE SAME FOUR FILES IN THE ORDER YOU WOULD WRITE THEM, WHICH IS NOT THE REVERSE.

  A learner who has only ever been shown the request path will sit down to build
  their own app and start at `urls.py`, which cannot be written first: a route needs
  a view to point at, a view needs a serializer, and a serializer names fields that
  have to exist on a model.

  Every stop below is authored rather than derived from the route above, and the
  three reasons are in the `TourRoute` doc comment: `via` has a direction, `title`
  is a claim that changes with the direction, and the two stops inside `views.py`
  do NOT swap. You write the function, then the line inside it; the request reaches
  the function, then the line inside it. Same order, in the middle of a reversal,
  which is exactly the thing a reversing figure would get wrong.
*/
const codeRoute: TourStop[] = [
  {
    id: 'c-model',
    file: 'products/models.py',
    range: [4, 7],
    title: 'Start with what a product IS',
    body: 'Every layer above this one takes its types from here.',
    via: 'serialize it',
    detail: 'Writing the model first is not a style preference. A serializer names fields, so the fields have to exist, and the migration that creates the table is generated from this file and nothing downstream of it.',
  },
  {
    id: 'c-serializer',
    file: 'products/serializers.py',
    range: [6, 9],
    title: 'Then decide what is allowed to leave',
    body: 'The field list is a promise to whoever calls the API.',
    via: 'use it in a view',
    detail: 'Adding a field to the model changes nothing on the wire until it is added here too. That is the single most common cause of "my new column is missing from the API".',
  },
  {
    id: 'c-view',
    file: 'products/views.py',
    range: [8, 12],
    title: 'Then write the four lines that answer',
    body: 'Fetch, serialize, respond. Anything more belongs elsewhere.',
    via: 'inside the same function',
    detail: 'The decorator rejects every verb except GET before this function body runs, which is why there is no method check inside it.',
  },
  {
    id: 'c-query',
    file: 'products/views.py',
    range: [10, 10],
    title: 'And the one line that reaches the data',
    body: 'A queryset, not a list. Nothing has been fetched yet.',
    via: 'expose it at a path',
    detail: 'Django does not hit the database here. The query runs when the serializer iterates it on the next line, which is why a slow endpoint is rarely slow on the line that looks like the query.',
  },
  {
    id: 'c-route',
    file: 'products/urls.py',
    range: [5, 7],
    title: 'Last, give the whole thing an address',
    body: 'Nothing you just wrote is reachable until this line exists.',
    detail: 'The trailing slash matters: without it Django redirects, and a client that does not follow redirects sees a 301 rather than the list.',
  },
]

export const apiSliceFixture: ProjectFigureProps = {
  files: [
    {
      path: 'products/models.py',
      language: 'python',
      layer: 'data',
      role: 'What a product IS, and the table behind it',
      lines: [
        'from django.db import models',
        '',
        '',
        'class Product(models.Model):',
        '    name = models.CharField(max_length=120)',
        '    price = models.DecimalField(max_digits=8, decimal_places=2)',
        '    in_stock = models.BooleanField(default=True)',
        '',
        '    def __str__(self):',
        '        return self.name',
      ],
    },
    {
      path: 'products/serializers.py',
      language: 'python',
      layer: 'translation',
      role: 'The bridge between a row and JSON',
      lines: [
        'from rest_framework import serializers',
        '',
        'from .models import Product',
        '',
        '',
        'class ProductSerializer(serializers.ModelSerializer):',
        '    class Meta:',
        '        model = Product',
        '        fields = ["id", "name", "price", "in_stock"]',
      ],
    },
    {
      path: 'products/views.py',
      language: 'python',
      layer: 'request handling',
      role: 'What happens when the URL is hit',
      lines: [
        'from rest_framework.decorators import api_view',
        'from rest_framework.response import Response',
        '',
        'from .models import Product',
        'from .serializers import ProductSerializer',
        '',
        '',
        '@api_view(["GET"])',
        'def product_list(request):',
        '    products = Product.objects.all()',
        '    data = ProductSerializer(products, many=True).data',
        '    return Response(data)',
      ],
    },
    {
      path: 'products/urls.py',
      language: 'python',
      layer: 'routing',
      role: 'Which address reaches which view',
      lines: [
        'from django.urls import path',
        '',
        'from .views import product_list',
        '',
        'urlpatterns = [',
        '    path("api/products/", product_list, name="products"),',
        ']',
      ],
    },
  ],

  stops: requestRoute,
  routes: [
    { id: 'request', label: 'Request flow', claim: 'The order it happens in, when somebody visits the URL.', stops: requestRoute },
    { id: 'code', label: 'Code flow', claim: 'The order you write it in, which is very nearly the reverse.', stops: codeRoute },
  ],

  caption: 'Four files, one request, in the order it actually happens.',
}