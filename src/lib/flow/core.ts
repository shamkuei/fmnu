import type { $, Kind } from "hkt-toolbelt";
import type { Identity } from "hkt-toolbelt/function.js";

export type Action<C, O> = (ctx: C) => Promise<O>;

export type InputOf<A> = A extends Action<infer C, any> ? C : never;
export type OutputOf<A> = A extends Action<any, infer O> ? O : never;

export type BaseContext = Record<string, any>;

export type Prettify<T> = { [K in keyof T]: T[K] };

export type Layer<
  Input extends BaseContext = {},
  Adds extends BaseContext = {},
  LayerHKT extends Kind.Kind = Identity,
> = (
  ctx: Input,
  next: (adds: Adds) => Promise<Parameters<LayerHKT["f"]>[0]>,
) => Promise<$<LayerHKT, any>>;

export type LayerInput<T> = T extends Layer<infer I, any, any> ? I : never;
export type LayerAdds<T> = T extends Layer<any, infer A, any> ? A : never;
export type LayerHKT<T> = T extends Layer<any, any, infer H> ? H : never;

export class Flow<
  Input extends BaseContext = {},
  Context extends BaseContext = {},
  ComposedHKT extends Kind.Kind = Identity,
> {
  constructor(private layers: Layer<any, any, any>[] = []) {}

  layer<I extends BaseContext, A extends BaseContext, T extends Kind.Kind>(
    layer: Layer<I, A, T>,
  ): Flow<
    Prettify<Omit<Input, keyof A> & I>,
    Prettify<Context & A & Input>,
    $<Kind.Compose, [T, ComposedHKT]>
  > {
    return new Flow([...this.layers, layer]);
  }

  build<O extends Kind._$inputOf<ComposedHKT>>(
    action: Action<Context, O>,
  ): Action<Input & BaseContext, $<ComposedHKT, O>> {
    return (input) => {
      let idx = 0;

      const runner = (ctx: any): Promise<any> => {
        if (idx >= this.layers.length) {
          return action(ctx);
        } else {
          const layer = this.layers[idx++];
          return layer(ctx, (adds) => runner({ ...ctx, ...adds }));
        }
      };

      return runner(input);
    };
  }
}
