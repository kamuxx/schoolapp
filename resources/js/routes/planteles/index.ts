import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SchoolController::index
 * @see app/Http/Controllers/SchoolController.php:17
 * @route '/institucional/planteles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/institucional/planteles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SchoolController::index
 * @see app/Http/Controllers/SchoolController.php:17
 * @route '/institucional/planteles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SchoolController::index
 * @see app/Http/Controllers/SchoolController.php:17
 * @route '/institucional/planteles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SchoolController::index
 * @see app/Http/Controllers/SchoolController.php:17
 * @route '/institucional/planteles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SchoolController::index
 * @see app/Http/Controllers/SchoolController.php:17
 * @route '/institucional/planteles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SchoolController::index
 * @see app/Http/Controllers/SchoolController.php:17
 * @route '/institucional/planteles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SchoolController::index
 * @see app/Http/Controllers/SchoolController.php:17
 * @route '/institucional/planteles'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\SchoolController::create
 * @see app/Http/Controllers/SchoolController.php:31
 * @route '/institucional/planteles/nuevo'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/institucional/planteles/nuevo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SchoolController::create
 * @see app/Http/Controllers/SchoolController.php:31
 * @route '/institucional/planteles/nuevo'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SchoolController::create
 * @see app/Http/Controllers/SchoolController.php:31
 * @route '/institucional/planteles/nuevo'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SchoolController::create
 * @see app/Http/Controllers/SchoolController.php:31
 * @route '/institucional/planteles/nuevo'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SchoolController::create
 * @see app/Http/Controllers/SchoolController.php:31
 * @route '/institucional/planteles/nuevo'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SchoolController::create
 * @see app/Http/Controllers/SchoolController.php:31
 * @route '/institucional/planteles/nuevo'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SchoolController::create
 * @see app/Http/Controllers/SchoolController.php:31
 * @route '/institucional/planteles/nuevo'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\SchoolController::store
 * @see app/Http/Controllers/SchoolController.php:50
 * @route '/institucional/planteles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/institucional/planteles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SchoolController::store
 * @see app/Http/Controllers/SchoolController.php:50
 * @route '/institucional/planteles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SchoolController::store
 * @see app/Http/Controllers/SchoolController.php:50
 * @route '/institucional/planteles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SchoolController::store
 * @see app/Http/Controllers/SchoolController.php:50
 * @route '/institucional/planteles'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SchoolController::store
 * @see app/Http/Controllers/SchoolController.php:50
 * @route '/institucional/planteles'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const planteles = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
}

export default planteles