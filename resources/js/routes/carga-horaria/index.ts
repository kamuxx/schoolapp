import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CargaHorariaController::teacher
 * @see app/Http/Controllers/CargaHorariaController.php:20
 * @route '/filiacion/carga-horaria/docente/{employeeId}'
 */
export const teacher = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: teacher.url(args, options),
    method: 'get',
})

teacher.definition = {
    methods: ["get","head"],
    url: '/filiacion/carga-horaria/docente/{employeeId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CargaHorariaController::teacher
 * @see app/Http/Controllers/CargaHorariaController.php:20
 * @route '/filiacion/carga-horaria/docente/{employeeId}'
 */
teacher.url = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employeeId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employeeId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employeeId: args.employeeId,
                }

    return teacher.definition.url
            .replace('{employeeId}', parsedArgs.employeeId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CargaHorariaController::teacher
 * @see app/Http/Controllers/CargaHorariaController.php:20
 * @route '/filiacion/carga-horaria/docente/{employeeId}'
 */
teacher.get = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: teacher.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CargaHorariaController::teacher
 * @see app/Http/Controllers/CargaHorariaController.php:20
 * @route '/filiacion/carga-horaria/docente/{employeeId}'
 */
teacher.head = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: teacher.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CargaHorariaController::teacher
 * @see app/Http/Controllers/CargaHorariaController.php:20
 * @route '/filiacion/carga-horaria/docente/{employeeId}'
 */
    const teacherForm = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: teacher.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CargaHorariaController::teacher
 * @see app/Http/Controllers/CargaHorariaController.php:20
 * @route '/filiacion/carga-horaria/docente/{employeeId}'
 */
        teacherForm.get = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: teacher.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CargaHorariaController::teacher
 * @see app/Http/Controllers/CargaHorariaController.php:20
 * @route '/filiacion/carga-horaria/docente/{employeeId}'
 */
        teacherForm.head = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: teacher.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    teacher.form = teacherForm
/**
* @see \App\Http\Controllers\CargaHorariaController::catalog
 * @see app/Http/Controllers/CargaHorariaController.php:105
 * @route '/filiacion/carga-horaria/docente/{employeeId}/catalog'
 */
export const catalog = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalog.url(args, options),
    method: 'get',
})

catalog.definition = {
    methods: ["get","head"],
    url: '/filiacion/carga-horaria/docente/{employeeId}/catalog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CargaHorariaController::catalog
 * @see app/Http/Controllers/CargaHorariaController.php:105
 * @route '/filiacion/carga-horaria/docente/{employeeId}/catalog'
 */
catalog.url = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employeeId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employeeId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employeeId: args.employeeId,
                }

    return catalog.definition.url
            .replace('{employeeId}', parsedArgs.employeeId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CargaHorariaController::catalog
 * @see app/Http/Controllers/CargaHorariaController.php:105
 * @route '/filiacion/carga-horaria/docente/{employeeId}/catalog'
 */
catalog.get = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalog.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CargaHorariaController::catalog
 * @see app/Http/Controllers/CargaHorariaController.php:105
 * @route '/filiacion/carga-horaria/docente/{employeeId}/catalog'
 */
catalog.head = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: catalog.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CargaHorariaController::catalog
 * @see app/Http/Controllers/CargaHorariaController.php:105
 * @route '/filiacion/carga-horaria/docente/{employeeId}/catalog'
 */
    const catalogForm = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: catalog.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CargaHorariaController::catalog
 * @see app/Http/Controllers/CargaHorariaController.php:105
 * @route '/filiacion/carga-horaria/docente/{employeeId}/catalog'
 */
        catalogForm.get = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalog.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CargaHorariaController::catalog
 * @see app/Http/Controllers/CargaHorariaController.php:105
 * @route '/filiacion/carga-horaria/docente/{employeeId}/catalog'
 */
        catalogForm.head = (args: { employeeId: string | number } | [employeeId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalog.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    catalog.form = catalogForm
/**
* @see \App\Http\Controllers\CargaHorariaController::store
 * @see app/Http/Controllers/CargaHorariaController.php:47
 * @route '/filiacion/carga-horaria/asignar'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/filiacion/carga-horaria/asignar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CargaHorariaController::store
 * @see app/Http/Controllers/CargaHorariaController.php:47
 * @route '/filiacion/carga-horaria/asignar'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CargaHorariaController::store
 * @see app/Http/Controllers/CargaHorariaController.php:47
 * @route '/filiacion/carga-horaria/asignar'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CargaHorariaController::store
 * @see app/Http/Controllers/CargaHorariaController.php:47
 * @route '/filiacion/carga-horaria/asignar'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CargaHorariaController::store
 * @see app/Http/Controllers/CargaHorariaController.php:47
 * @route '/filiacion/carga-horaria/asignar'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CargaHorariaController::sync
 * @see app/Http/Controllers/CargaHorariaController.php:156
 * @route '/filiacion/carga-horaria/sync'
 */
export const sync = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
})

sync.definition = {
    methods: ["post"],
    url: '/filiacion/carga-horaria/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CargaHorariaController::sync
 * @see app/Http/Controllers/CargaHorariaController.php:156
 * @route '/filiacion/carga-horaria/sync'
 */
sync.url = (options?: RouteQueryOptions) => {
    return sync.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CargaHorariaController::sync
 * @see app/Http/Controllers/CargaHorariaController.php:156
 * @route '/filiacion/carga-horaria/sync'
 */
sync.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CargaHorariaController::sync
 * @see app/Http/Controllers/CargaHorariaController.php:156
 * @route '/filiacion/carga-horaria/sync'
 */
    const syncForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sync.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CargaHorariaController::sync
 * @see app/Http/Controllers/CargaHorariaController.php:156
 * @route '/filiacion/carga-horaria/sync'
 */
        syncForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sync.url(options),
            method: 'post',
        })
    
    sync.form = syncForm
/**
* @see \App\Http\Controllers\CargaHorariaController::destroy
 * @see app/Http/Controllers/CargaHorariaController.php:212
 * @route '/filiacion/carga-horaria/eliminar/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/filiacion/carga-horaria/eliminar/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CargaHorariaController::destroy
 * @see app/Http/Controllers/CargaHorariaController.php:212
 * @route '/filiacion/carga-horaria/eliminar/{id}'
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
* @see \App\Http\Controllers\CargaHorariaController::destroy
 * @see app/Http/Controllers/CargaHorariaController.php:212
 * @route '/filiacion/carga-horaria/eliminar/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CargaHorariaController::destroy
 * @see app/Http/Controllers/CargaHorariaController.php:212
 * @route '/filiacion/carga-horaria/eliminar/{id}'
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
* @see \App\Http\Controllers\CargaHorariaController::destroy
 * @see app/Http/Controllers/CargaHorariaController.php:212
 * @route '/filiacion/carga-horaria/eliminar/{id}'
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
const cargaHoraria = {
    teacher: Object.assign(teacher, teacher),
catalog: Object.assign(catalog, catalog),
store: Object.assign(store, store),
sync: Object.assign(sync, sync),
destroy: Object.assign(destroy, destroy),
}

export default cargaHoraria