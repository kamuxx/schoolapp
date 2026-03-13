import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:18
 * @route '/config/anios-escolares'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/config/anios-escolares',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:18
 * @route '/config/anios-escolares'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:18
 * @route '/config/anios-escolares'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:18
 * @route '/config/anios-escolares'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:18
 * @route '/config/anios-escolares'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:18
 * @route '/config/anios-escolares'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AcademicYearController::index
 * @see app/Http/Controllers/AcademicYearController.php:18
 * @route '/config/anios-escolares'
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
* @see \App\Http\Controllers\AcademicYearController::store
 * @see app/Http/Controllers/AcademicYearController.php:25
 * @route '/config/anios-escolares'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/config/anios-escolares',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AcademicYearController::store
 * @see app/Http/Controllers/AcademicYearController.php:25
 * @route '/config/anios-escolares'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicYearController::store
 * @see app/Http/Controllers/AcademicYearController.php:25
 * @route '/config/anios-escolares'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AcademicYearController::store
 * @see app/Http/Controllers/AcademicYearController.php:25
 * @route '/config/anios-escolares'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AcademicYearController::store
 * @see app/Http/Controllers/AcademicYearController.php:25
 * @route '/config/anios-escolares'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AcademicYearController::update
 * @see app/Http/Controllers/AcademicYearController.php:37
 * @route '/config/anios-escolares/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/config/anios-escolares/{id}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\AcademicYearController::update
 * @see app/Http/Controllers/AcademicYearController.php:37
 * @route '/config/anios-escolares/{id}'
 */
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicYearController::update
 * @see app/Http/Controllers/AcademicYearController.php:37
 * @route '/config/anios-escolares/{id}'
 */
update.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AcademicYearController::update
 * @see app/Http/Controllers/AcademicYearController.php:37
 * @route '/config/anios-escolares/{id}'
 */
    const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AcademicYearController::update
 * @see app/Http/Controllers/AcademicYearController.php:37
 * @route '/config/anios-escolares/{id}'
 */
        updateForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\AcademicYearController::destroy
 * @see app/Http/Controllers/AcademicYearController.php:49
 * @route '/config/anios-escolares/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/config/anios-escolares/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AcademicYearController::destroy
 * @see app/Http/Controllers/AcademicYearController.php:49
 * @route '/config/anios-escolares/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AcademicYearController::destroy
 * @see app/Http/Controllers/AcademicYearController.php:49
 * @route '/config/anios-escolares/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AcademicYearController::destroy
 * @see app/Http/Controllers/AcademicYearController.php:49
 * @route '/config/anios-escolares/{id}'
 */
    const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AcademicYearController::destroy
 * @see app/Http/Controllers/AcademicYearController.php:49
 * @route '/config/anios-escolares/{id}'
 */
        destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const academicYears = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default academicYears